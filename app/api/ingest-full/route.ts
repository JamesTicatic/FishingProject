import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllStories } from '@/data/stories';
import { verifyAdminAuth } from '@/lib/auth';
import { getDb, schema } from '@/db';

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

  const { db, pool } = getDb();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });

  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');

    // Non-destructive schema check for stories_embedding table
    await pool.query(
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
      
      // Non-destructive Drizzle ORM upsert
      await db.insert(schema.storiesEmbedding)
        .values({
          storyId: story.id,
          title: story.title,
          excerpt: story.excerpt,
          species: story.species,
          gear: story.gear,
          location: story.location,
          date: story.date,
          embedding: embedding,
        })
        .onConflictDoUpdate({
          target: schema.storiesEmbedding.storyId,
          set: {
            title: story.title,
            excerpt: story.excerpt,
            species: story.species,
            gear: story.gear,
            location: story.location,
            date: story.date,
            embedding: embedding,
          },
        });
      ingestedCount++;
    }

    return NextResponse.json({
      success: true,
      message: "Successfully ingested " + ingestedCount + " stories into Postgres using Drizzle ORM (Full-Article)."
    });

  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

