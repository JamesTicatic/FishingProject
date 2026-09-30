import os

code = '''import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllStories } from '@/data/stories';

export async function GET(request: Request) {
  // In a real production app, you would secure this route with a secret key
  // e.g. checking a search parameter or authorization header.
  
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
    // 1. Setup the database table
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');
    await pool.query(
      CREATE TABLE IF NOT EXISTS stories_embedding (
        id SERIAL PRIMARY KEY,
        story_id VARCHAR(255) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        embedding vector(768)
      );
    );

    // 2. Fetch all local stories
    const stories = getAllStories();
    let ingestedCount = 0;

    // 3. Generate embeddings and insert into Postgres
    for (const story of stories) {
      // Create a rich text representation for the embedding model to read
      const textToEmbed = Title: \\nExcerpt: \\nSpecies: \\nLocation: \\nContent: ;
      
      const result = await model.embedContent(textToEmbed);
      const embedding = result.embedding.values;
      
      // Upsert into Postgres (update if the story_id already exists)
      await pool.query(
        INSERT INTO stories_embedding (story_id, title, excerpt, embedding) 
         VALUES (, , , )
         ON CONFLICT (story_id) 
         DO UPDATE SET 
           title = EXCLUDED.title, 
           excerpt = EXCLUDED.excerpt, 
           embedding = EXCLUDED.embedding;,
        [story.id, story.title, story.excerpt, []]
      );
      ingestedCount++;
    }

    return NextResponse.json({
      success: true,
      message: Successfully ingested  stories into Postgres.
    });

  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Edge/Serverless functions handles Neon connections gracefully, but it's safe to not await pool.end() if cached globally.
    // We will just let the lambda spin down.
  }
}
'''

with open('app/api/ingest/route.ts', 'w', encoding='utf-8') as f:
    f.write(code)
