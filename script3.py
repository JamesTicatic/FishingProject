import os

code = '''import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not set.' }, { status: 500 });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Basic setup if no query is provided
    if (!query) {
      // Just check if the table exists
      const tableCheck = await pool.query(
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'stories_embedding'
        );
      );
      
      const isReady = tableCheck.rows[0].exists;

      return NextResponse.json({
        message: isReady ? 'Postgres pgvector search is ready.' : 'Database table not found. Please run the /api/ingest route first.',
        usage: 'Add ?q=your_search_query to perform a vector search.'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    // Generate an embedding for the user's search query
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    // Search the database using the pgvector <-> operator (L2 distance)
    // We order by distance ascending (closest first) and limit to top 3 results.
    const searchResults = await pool.query(
      SELECT story_id, title, excerpt, 
              1 - (embedding <=> ) as similarity 
       FROM stories_embedding 
       ORDER BY embedding <=>  
       LIMIT 3;,
      [[]]
    );

    return NextResponse.json({
      query: query,
      results: searchResults.rows
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
'''

with open('app/api/search/route.ts', 'w', encoding='utf-8') as f:
    f.write(code)
