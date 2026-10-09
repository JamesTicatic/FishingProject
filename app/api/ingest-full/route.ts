import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllStories } from '@/data/stories';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = verifyAdminAuth(request);
  if (!auth.isAuthorized && auth.response) {
    return auth.response;
  }

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

    // Create Stories Embedding Table with species, gear, and location columns
    await pool.query(
      "DROP TABLE IF EXISTS stories_embedding;\n" +
      "CREATE TABLE IF NOT EXISTS stories_embedding (" +
      "  id SERIAL PRIMARY KEY," +
      "  story_id VARCHAR(255) UNIQUE NOT NULL," +
      "  title TEXT NOT NULL," +
      "  excerpt TEXT NOT NULL," +
      "  species TEXT[]," +
      "  gear TEXT[]," +
      "  location TEXT," +
      "  date DATE," +
      "  embedding vector(3072)" +
      ");"
    );

    const stories = getAllStories();
    let ingestedCount = 0;

    for (const story of stories) {
      const textToEmbed = "Title: " + story.title + "\nExcerpt: " + story.excerpt + "\nSpecies: " + story.species.join(', ') + "\nGear: " + story.gear.join(', ') + "\nLocation: " + story.location + "\nContent: " + story.content;
      
      const result = await model.embedContent(textToEmbed);
      const embedding = result.embedding.values;
      
      await pool.query(
        "INSERT INTO stories_embedding (story_id, title, excerpt, species, gear, location, date, embedding) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8) " +
        "ON CONFLICT (story_id) " +
        "DO UPDATE SET " +
        "  title = EXCLUDED.title, " +
        "  excerpt = EXCLUDED.excerpt, " +
        "  species = EXCLUDED.species, " +
        "  gear = EXCLUDED.gear, " +
        "  location = EXCLUDED.location, " +
        "  date = EXCLUDED.date, " +
        "  embedding = EXCLUDED.embedding;",
        [story.id, story.title, story.excerpt, story.species, story.gear, story.location, story.date, "[" + embedding.join(',') + "]"]
      );
      ingestedCount++;
    }

    return NextResponse.json({
      success: true,
      message: "Successfully ingested " + ingestedCount + " stories into Postgres (Legacy Full Text)."
    });

  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
