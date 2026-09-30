import os
import urllib.request

ingest_code = '''import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllStories } from '@/data/stories';

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not set.' }, { status: 500 });
  }
  
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set.' }, { status: 500 });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');
    await pool.query(
      "CREATE TABLE IF NOT EXISTS stories_embedding (" +
      "  id SERIAL PRIMARY KEY," +
      "  story_id VARCHAR(255) UNIQUE NOT NULL," +
      "  title TEXT NOT NULL," +
      "  excerpt TEXT NOT NULL," +
      "  embedding vector(768)" +
      ");"
    );

    const stories = getAllStories();
    let ingestedCount = 0;

    for (const story of stories) {
      const textToEmbed = "Title: " + story.title + "\\nExcerpt: " + story.excerpt + "\\nSpecies: " + story.species.join(', ') + "\\nLocation: " + story.location + "\\nContent: " + story.content;
      
      const result = await model.embedContent(textToEmbed);
      const embedding = result.embedding.values;
      
      await pool.query(
        "INSERT INTO stories_embedding (story_id, title, excerpt, embedding) " +
        "VALUES (, , , ) " +
        "ON CONFLICT (story_id) " +
        "DO UPDATE SET " +
        "  title = EXCLUDED.title, " +
        "  excerpt = EXCLUDED.excerpt, " +
        "  embedding = EXCLUDED.embedding;",
        [story.id, story.title, story.excerpt, "[" + embedding.join(',') + "]"]
      );
      ingestedCount++;
    }

    return NextResponse.json({
      success: true,
      message: "Successfully ingested " + ingestedCount + " stories into Postgres."
    });

  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
'''

search_code = '''import { NextResponse } from 'next/server';
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
    if (!query) {
      const tableCheck = await pool.query(
        "SELECT EXISTS (" +
        "  SELECT FROM information_schema.tables " +
        "  WHERE table_name = 'stories_embedding'" +
        ");"
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

    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    const searchResults = await pool.query(
      "SELECT story_id, title, excerpt, " +
      "       1 - (embedding <=> ) as similarity " +
      "FROM stories_embedding " +
      "ORDER BY embedding <=>  " +
      "LIMIT 3;",
      ["[" + embedding.join(',') + "]"]
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

with open('app/api/ingest/route.ts', 'w', encoding='utf-8') as f:
    f.write(ingest_code)

with open('app/api/search/route.ts', 'w', encoding='utf-8') as f:
    f.write(search_code)
