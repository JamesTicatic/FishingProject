import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDb } from '@/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not set.' }, { status: 500 });
  }

  const { pool } = getDb();

  try {
    if (!query) {
      const tableCheck = await pool.query(
        "SELECT EXISTS (" +
        "  SELECT FROM information_schema.tables " +
        "  WHERE table_name = 'story_chunks'" +
        ");"
      );

      const isReady = tableCheck.rows[0].exists;

      return NextResponse.json({
        message: isReady
          ? 'Postgres Hybrid Search with RRF is ready.'
          : 'Database table not found. Please run the /api/ingest route first.',
        usage: 'Add ?q=your_search_query to perform a Hybrid RRF search.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set.' }, { status: 500 });
    }

    // Generate Gemini dense vector embedding for the search query
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });

    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    const searchTerm = `%${query}%`;
    const vectorParam = "[" + embedding.join(',') + "]";
    const rrfK = 60; // Standard RRF constant parameter

    // SQL-Native Reciprocal Rank Fusion (RRF) Combining Lexical (tsvector) + Semantic (pgvector)
    const dbQuery = `
      WITH 
      -- 1. Lexical / Keyword Search Ranking
      lexical_ranks AS (
        SELECT 
          story_id,
          slug,
          title,
          excerpt,
          chunk_text,
          ROW_NUMBER() OVER (
            ORDER BY 
              (
                (LENGTH(LOWER(chunk_text)) - LENGTH(REPLACE(LOWER(chunk_text), LOWER($1), ''))) 
                / GREATEST(LENGTH($1), 1)
              ) DESC,
              ts_rank(to_tsvector('english', title || ' ' || excerpt || ' ' || chunk_text), plainto_tsquery('english', $1)) DESC
          ) as lexical_rank
        FROM story_chunks
        WHERE to_tsvector('english', title || ' ' || excerpt || ' ' || chunk_text) @@ plainto_tsquery('english', $1)
           OR title ILIKE $2 OR excerpt ILIKE $2 OR chunk_text ILIKE $2
      ),

      -- 2. Dense Vector Semantic Search Ranking
      vector_ranks AS (
        SELECT 
          story_id,
          slug,
          title,
          excerpt,
          chunk_text,
          1 - (embedding <=> $3) as vector_similarity,
          ROW_NUMBER() OVER (ORDER BY embedding <=> $3 ASC) as vector_rank
        FROM story_chunks
      ),

      -- 3. Combine both rank pools using Reciprocal Rank Fusion (RRF score = 1/(k + rank_lexical) + 1/(k + rank_vector))
      combined AS (
        SELECT 
          COALESCE(l.story_id, v.story_id) as story_id,
          COALESCE(l.slug, v.slug) as slug,
          COALESCE(l.title, v.title) as title,
          COALESCE(l.excerpt, v.excerpt) as excerpt,
          COALESCE(l.chunk_text, v.chunk_text) as chunk_text,
          l.lexical_rank,
          v.vector_rank,
          v.vector_similarity,
          (
            COALESCE(1.0 / (${rrfK} + l.lexical_rank), 0.0) +
            COALESCE(1.0 / (${rrfK} + v.vector_rank), 0.0)
          ) as rrf_score
        FROM vector_ranks v
        FULL OUTER JOIN lexical_ranks l 
          ON v.story_id = l.story_id AND v.chunk_text = l.chunk_text
      ),
      
      -- 4. Deduplicate per story keeping highest scoring paragraph chunk
      ranked_stories AS (
        SELECT DISTINCT ON (story_id)
          story_id,
          slug,
          title,
          excerpt,
          chunk_text,
          lexical_rank,
          vector_rank,
          COALESCE(vector_similarity, 0) as similarity,
          rrf_score
        FROM combined
        ORDER BY story_id, rrf_score DESC
      )
      SELECT * FROM ranked_stories
      ORDER BY rrf_score DESC
      LIMIT 3;
    `;

    const searchResults = await pool.query(dbQuery, [query, searchTerm, vectorParam]);

    return NextResponse.json({
      query: query,
      method: 'Reciprocal Rank Fusion (RRF)',
      rrf_k: rrfK,
      results: searchResults.rows,
    });

  } catch (error: any) {
    console.error('Hybrid search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
