import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDb, schema } from '@/db';
import { cosineDistance, desc, sql, ilike, or } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not set.' }, { status: 500 });
  }

  const { db } = getDb();

  try {
    if (!query) {
      return NextResponse.json({
        message: 'Postgres Hybrid Search with RRF is ready.',
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
    const rrfK = 60; // Standard RRF constant parameter

    // 1. Drizzle ORM Lexical Rank CTE
    const lexicalRanks = db.$with('lexical_ranks').as(
      db
        .select({
          storyId: schema.storyChunks.storyId,
          slug: schema.storyChunks.slug,
          title: schema.storyChunks.title,
          excerpt: schema.storyChunks.excerpt,
          chunkText: schema.storyChunks.chunkText,
          lexicalRank: sql<number>`ROW_NUMBER() OVER (
            ORDER BY 
              (
                (LENGTH(LOWER(${schema.storyChunks.chunkText})) - LENGTH(REPLACE(LOWER(${schema.storyChunks.chunkText}), LOWER(${query}), ''))) 
                / GREATEST(LENGTH(${query}), 1)
              ) DESC,
              ts_rank(to_tsvector('english', ${schema.storyChunks.title} || ' ' || ${schema.storyChunks.excerpt} || ' ' || ${schema.storyChunks.chunkText}), plainto_tsquery('english', ${query})) DESC
          )`.as('lexical_rank'),
        })
        .from(schema.storyChunks)
        .where(
          or(
            sql`to_tsvector('english', ${schema.storyChunks.title} || ' ' || ${schema.storyChunks.excerpt} || ' ' || ${schema.storyChunks.chunkText}) @@ plainto_tsquery('english', ${query})`,
            ilike(schema.storyChunks.title, searchTerm),
            ilike(schema.storyChunks.excerpt, searchTerm),
            ilike(schema.storyChunks.chunkText, searchTerm)
          )
        )
    );

    // 2. Drizzle ORM Dense Vector Rank CTE
    const vectorRanks = db.$with('vector_ranks').as(
      db
        .select({
          storyId: schema.storyChunks.storyId,
          slug: schema.storyChunks.slug,
          title: schema.storyChunks.title,
          excerpt: schema.storyChunks.excerpt,
          chunkText: schema.storyChunks.chunkText,
          vectorSimilarity: sql<number>`1 - (${cosineDistance(schema.storyChunks.embedding, embedding)})`.as('vector_similarity'),
          vectorRank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${cosineDistance(schema.storyChunks.embedding, embedding)} ASC)`.as('vector_rank'),
        })
        .from(schema.storyChunks)
    );

    // Expression for calculated RRF score
    const rrfScoreExpr = sql<number>`(
      COALESCE(1.0 / (${rrfK} + ${lexicalRanks.lexicalRank}), 0.0) +
      COALESCE(1.0 / (${rrfK} + ${vectorRanks.vectorRank}), 0.0)
    )`;

    // 3. Execute Drizzle RRF Fusion Query combining both CTEs
    const searchResults = await db
      .with(lexicalRanks, vectorRanks)
      .select({
        story_id: sql<string>`COALESCE(${lexicalRanks.storyId}, ${vectorRanks.storyId})`,
        slug: sql<string>`COALESCE(${lexicalRanks.slug}, ${vectorRanks.slug})`,
        title: sql<string>`COALESCE(${lexicalRanks.title}, ${vectorRanks.title})`,
        excerpt: sql<string>`COALESCE(${lexicalRanks.excerpt}, ${vectorRanks.excerpt})`,
        chunk_text: sql<string>`COALESCE(${lexicalRanks.chunkText}, ${vectorRanks.chunkText})`,
        lexical_rank: lexicalRanks.lexicalRank,
        vector_rank: vectorRanks.vectorRank,
        similarity: sql<number>`COALESCE(${vectorRanks.vectorSimilarity}, 0)`,
        rrf_score: rrfScoreExpr.as('rrf_score'),
      })
      .from(vectorRanks)
      .fullJoin(
        lexicalRanks,
        sql`${vectorRanks.storyId} = ${lexicalRanks.storyId} AND ${vectorRanks.chunkText} = ${lexicalRanks.chunkText}`
      )
      .orderBy(desc(rrfScoreExpr))
      .limit(3);

    return NextResponse.json({
      query: query,
      method: 'Reciprocal Rank Fusion (RRF)',
      rrf_k: rrfK,
      results: searchResults,
    });

  } catch (error: any) {
    console.error('Hybrid search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
