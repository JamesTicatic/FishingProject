import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SPECIES_LIST } from '@/data/species';
import { GEAR_LIST } from '@/data/gear';
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
    
    // Create Species Table
    await pool.query(
      "CREATE TABLE IF NOT EXISTS species (" +
      "  id SERIAL PRIMARY KEY," +
      "  name VARCHAR(100) UNIQUE NOT NULL" +
      ");"
    );

    // Create Gear Table
    await pool.query(
      "CREATE TABLE IF NOT EXISTS gear (" +
      "  id SERIAL PRIMARY KEY," +
      "  name VARCHAR(100) UNIQUE NOT NULL" +
      ");"
    );

    // Create Location Table
    await pool.query(
      "CREATE TABLE IF NOT EXISTS location (" +
      "  id SERIAL PRIMARY KEY," +
      "  name VARCHAR(255) UNIQUE NOT NULL" +
      ");"
    );

    // Ingest Species List
    for (const speciesName of SPECIES_LIST) {
      await pool.query(
        "INSERT INTO species (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;",
        [speciesName]
      );
    }

    // Ingest Gear List
    for (const gearName of GEAR_LIST) {
      await pool.query(
        "INSERT INTO gear (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;",
        [gearName]
      );
    }

    // Ingest Location List
    const { LOCATION_LIST } = await import('@/data/locations');
    for (const locationName of LOCATION_LIST) {
      await pool.query(
        "INSERT INTO location (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;",
        [locationName]
      );
    }

    // Create Story Chunks Table with species, gear, and location columns
    await pool.query(
      "DROP TABLE IF EXISTS stories_embedding;" // Clean up old table
    );
    await pool.query(
      "DROP TABLE IF EXISTS story_chunks;\n      CREATE TABLE IF NOT EXISTS story_chunks (" +
      "  id SERIAL PRIMARY KEY," +
      "  story_id VARCHAR(255) NOT NULL," +
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

    const stories = getAllStories();
    let ingestedCount = 0;
    let chunksCount = 0;

    for (const story of stories) {
      // Split content into paragraphs, filtering out empty ones
      const paragraphs = story.content.split('\n\n').map(p => p.trim()).filter(Boolean);

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        
        // Add minimal context to the chunk for better embeddings
        const textToEmbed = "Story Title: " + story.title + "\nParagraph: " + paragraph;
        
        const result = await model.embedContent(textToEmbed);
        const embedding = result.embedding.values;
        
        await pool.query(
          "INSERT INTO story_chunks (story_id, title, excerpt, species, gear, location, date, chunk_index, chunk_text, embedding) " +
          "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
          [story.id, story.title, story.excerpt, story.species, story.gear, story.location, story.date, i, paragraph, "[" + embedding.join(',') + "]"]
        );
        chunksCount++;
      }
      ingestedCount++;
    }

    return NextResponse.json({
      success: true,
      message: "Successfully ingested " + ingestedCount + " stories into " + chunksCount + " chunks."
    });

  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
