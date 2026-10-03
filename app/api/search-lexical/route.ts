import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not set.' }, { status: 500 });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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
        message: isReady ? 'Postgres lexical full-text search is ready.' : 'Database table not found. Please run the /api/ingest route first.',
        usage: 'Add ?q=your_search_query to perform a lexical search.'
      });
    }

    const searchTerm = `%${query}%`;

    const dbQuery = `
      WITH chunk_counts AS (
        SELECT 
          story_id, slug, title, excerpt, chunk_text,
          (
            (LENGTH(LOWER(chunk_text)) - 
             LENGTH(REPLACE(LOWER(chunk_text), LOWER($1), ''))) 
            / GREATEST(LENGTH($1), 1)
          )::INT as chunk_match_count,
          ts_rank(to_tsvector('english', title || ' ' || excerpt || ' ' || chunk_text), plainto_tsquery('english', $1)) as rank
        FROM story_chunks
        WHERE to_tsvector('english', title || ' ' || excerpt || ' ' || chunk_text) @@ plainto_tsquery('english', $1)
           OR title ILIKE $2 OR excerpt ILIKE $2 OR chunk_text ILIKE $2
      ),
      header_counts AS (
        SELECT DISTINCT ON (story_id)
          story_id,
          (
            (LENGTH(LOWER(title || ' ' || excerpt)) - 
             LENGTH(REPLACE(LOWER(title || ' ' || excerpt), LOWER($1), ''))) 
            / GREATEST(LENGTH($1), 1)
          )::INT as header_match_count
        FROM story_chunks
      ),
      story_totals AS (
        SELECT 
          c.story_id, 
          (SUM(c.chunk_match_count) + h.header_match_count)::INT as match_count
        FROM chunk_counts c
        JOIN header_counts h ON c.story_id = h.story_id
        GROUP BY c.story_id, h.header_match_count
      ),
      best_chunks AS (
        SELECT DISTINCT ON (story_id)
          story_id, slug, title, excerpt, chunk_text, rank
        FROM chunk_counts
        ORDER BY story_id, chunk_match_count DESC, rank DESC
      )
      SELECT 
        b.story_id, b.slug, b.title, b.excerpt, b.chunk_text, 
        t.match_count, 
        b.rank as similarity
      FROM best_chunks b
      JOIN story_totals t ON b.story_id = t.story_id
      ORDER BY t.match_count DESC, b.rank DESC
      LIMIT 3;
    `;
    
    const queryParams = [query, searchTerm];

    const searchResults = await pool.query(dbQuery, queryParams);

    return NextResponse.json({
      query: query,
      results: searchResults.rows
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
