import { NextResponse } from 'next/server';
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
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });

  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');
    await pool.query(
      "DROP TABLE IF EXISTS stories_embedding;\n      CREATE TABLE IF NOT EXISTS stories_embedding (" +
      "  id SERIAL PRIMARY KEY," +
      "  story_id VARCHAR(255) UNIQUE NOT NULL," +
      "  title TEXT NOT NULL," +
      "  excerpt TEXT NOT NULL," +
      "  embedding vector(3072)" +
      ");"
    );

    const stories = getAllStories();
    let ingestedCount = 0;

    for (const story of stories) {
      const textToEmbed = "Title: " + story.title + "\nExcerpt: " + story.excerpt + "\nSpecies: " + story.species.join(', ') + "\nLocation: " + story.location + "\nContent: " + story.content;
      
      const result = await model.embedContent(textToEmbed);
      const embedding = result.embedding.values;
      
      await pool.query(
        "INSERT INTO stories_embedding (story_id, title, excerpt, embedding) " +
        "VALUES ($1, $2, $3, $4) " +
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
