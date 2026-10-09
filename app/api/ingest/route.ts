import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SPECIES_LIST } from '@/data/species';
import { GEAR_LIST } from '@/data/gear';
import { getAllStories } from '@/data/stories';
import { verifyAdminAuth } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

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
    // Ensure pgvector extension is present
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');

    // Non-destructive Drizzle schema table creation (if not exists)
    await pool.query(
      "CREATE TABLE IF NOT EXISTS species (id SERIAL PRIMARY KEY, name VARCHAR(100) UNIQUE NOT NULL);"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS gear (id SERIAL PRIMARY KEY, name VARCHAR(100) UNIQUE NOT NULL);"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS location (id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL);"
    );
    await pool.query(
      "CREATE TABLE IF NOT EXISTS story_chunks (" +
      "  id SERIAL PRIMARY KEY," +
      "  story_id VARCHAR(255) NOT NULL," +
      "  slug TEXT NOT NULL," +
      "  title TEXT NOT NULL," +
      "  excerpt TEXT NOT NULL," +
      "  species TEXT[]," +
      "  gear TEXT[]," +
      "  location TEXT," +
      "  date DATE," +
      "  chunk_index INT NOT NULL," +
      "  chunk_text TEXT NOT NULL," +
      "  embedding vector(3072)" +
      ");"
    );

    // Ingest Species List via Drizzle ORM
    for (const speciesName of SPECIES_LIST) {
      await db.insert(schema.species)
        .values({ name: speciesName })
        .onConflictDoNothing();
    }

    // Ingest Gear List via Drizzle ORM
    for (const gearName of GEAR_LIST) {
      await db.insert(schema.gear)
        .values({ name: gearName })
        .onConflictDoNothing();
    }

    // Ingest Location List via Drizzle ORM
    const { LOCATION_LIST } = await import('@/data/locations');
    for (const locationName of LOCATION_LIST) {
      await db.insert(schema.location)
        .values({ name: locationName })
        .onConflictDoNothing();
    }

    const stories = getAllStories();
    let ingestedCount = 0;
    let chunksCount = 0;

    for (const story of stories) {
      // Non-destructive cleanup: Delete existing chunks for this specific story before re-ingesting
      await db.delete(schema.storyChunks).where(eq(schema.storyChunks.storyId, story.id));

      const paragraphs = story.content.split('\n\n').map(p => p.trim()).filter(Boolean);

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        const textToEmbed = "Story Title: " + story.title + "\nParagraph: " + paragraph;
        
        const result = await model.embedContent(textToEmbed);
        const embedding = result.embedding.values;
        
        // Insert paragraph chunk using Drizzle ORM
        await db.insert(schema.storyChunks).values({
          storyId: story.id,
          slug: story.slug,
          title: story.title,
          excerpt: story.excerpt,
          species: story.species,
          gear: story.gear,
          location: story.location,
          date: story.date,
          chunkIndex: i,
          chunkText: paragraph,
          embedding: embedding,
        });
        chunksCount++;
      }
      ingestedCount++;
    }

    return NextResponse.json({
      success: true,
      message: "Successfully ingested " + ingestedCount + " stories into " + chunksCount + " chunks using Drizzle ORM."
    });

  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

