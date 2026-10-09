import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDb, schema } from '@/db';
import { cosineDistance, desc, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not set.' }, { status: 500 });
  }

  const { db } = getDb();

  try {
    if (!query) {
      return NextResponse.json({
        message: 'Postgres pgvector search is ready.',
        usage: 'Add ?q=your_search_query to perform a vector search.'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });

    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    // Type-safe Drizzle ORM query using cosineDistance helper (No raw SQL strings!)
    const similarity = sql<number>`1 - (${cosineDistance(schema.storyChunks.embedding, embedding)})`;

    const searchResults = await db
      .select({
        story_id: schema.storyChunks.storyId,
        slug: schema.storyChunks.slug,
        title: schema.storyChunks.title,
        excerpt: schema.storyChunks.excerpt,
        chunk_text: schema.storyChunks.chunkText,
        similarity,
      })
      .from(schema.storyChunks)
      .orderBy(desc(similarity))
      .limit(3);

    return NextResponse.json({
      query: query,
      results: searchResults
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
