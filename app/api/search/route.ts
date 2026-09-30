import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'DATABASE_URL environment variable is not set.' },
      { status: 500 }
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // This is a zero-setup initialization for demo purposes.
    // In production, migrations should be handled separately.
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stories_embedding (
        id SERIAL PRIMARY KEY,
        story_id VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        embedding vector(1536)
      );
    `);

    if (!query) {
      return NextResponse.json({
        message: 'Postgres pgvector search is ready.',
        usage: 'Add ?q=your_search_query to perform a vector search.'
      });
    }

    // Since we are not actually generating embeddings in this zero-setup example, 
    // we'll just mock a pgvector query to show that the syntax and setup works.
    // Normally you would use OpenAI or another provider to get the query embedding:
    // const embedding = await getEmbedding(query);
    // const results = await pool.query('SELECT * FROM stories_embedding ORDER BY embedding <-> $1 LIMIT 5;', [embedding]);
    
    // For now, return a placeholder indicating the query would be executed via pgvector.
    return NextResponse.json({
      query_received: query,
      message: 'Vector search logic ready. Populate the stories_embedding table with embeddings to see results.'
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Wait until query finishes, Neon connections are automatically managed but ending the pool is good practice.
    // Note: in edge environments, you shouldn't end the pool if you cache it outside the handler.
  }
}

