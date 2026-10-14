import { NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { desc, eq, ilike, or, sql } from 'drizzle-orm';

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
        message: 'Postgres lexical full-text search is ready.',
        usage: 'Add ?q=your_search_query to perform a lexical search.'
      });
    }

    const searchTerm = `%${query}%`;

    // 1. Drizzle ORM Lexical Ranked Chunks CTE
    const rankedChunks = db.$with('ranked_chunks').as(
      db
        .select({
          storyId: schema.storyChunks.storyId,
          slug: schema.storyChunks.slug,
          title: schema.storyChunks.title,
          excerpt: schema.storyChunks.excerpt,
          chunkText: schema.storyChunks.chunkText,
          matchCount: sql<number>`(
            SUM(
              (LENGTH(LOWER(${schema.storyChunks.chunkText})) - 
               LENGTH(REPLACE(LOWER(${schema.storyChunks.chunkText}), LOWER(${query}), ''))) 
              / GREATEST(LENGTH(${query}), 1)
            ) OVER (PARTITION BY ${schema.storyChunks.storyId})
            +
            (
              (LENGTH(LOWER(${schema.storyChunks.title} || ' ' || ${schema.storyChunks.excerpt})) - 
               LENGTH(REPLACE(LOWER(${schema.storyChunks.title} || ' ' || ${schema.storyChunks.excerpt}), LOWER(${query}), ''))) 
              / GREATEST(LENGTH(${query}), 1)
            )
          )::INT`.as('match_count'),
          similarity: sql<number>`ts_rank(
            to_tsvector('english', ${schema.storyChunks.title} || ' ' || ${schema.storyChunks.excerpt} || ' ' || ${schema.storyChunks.chunkText}), 
            plainto_tsquery('english', ${query})
          )`.as('similarity'),
          rn: sql<number>`ROW_NUMBER() OVER (
            PARTITION BY ${schema.storyChunks.storyId}
            ORDER BY 
              (
                (LENGTH(LOWER(${schema.storyChunks.chunkText})) - 
                 LENGTH(REPLACE(LOWER(${schema.storyChunks.chunkText}), LOWER(${query}), ''))) 
                / GREATEST(LENGTH(${query}), 1)
              ) DESC,
              ts_rank(
                to_tsvector('english', ${schema.storyChunks.title} || ' ' || ${schema.storyChunks.excerpt} || ' ' || ${schema.storyChunks.chunkText}), 
                plainto_tsquery('english', ${query})
              ) DESC
          )`.as('rn'),
        })
        .from(schema.storyChunks)
        .where(
          or(
            sql`to_tsvector('english', ${schema.storyChunks.title} || ' ' || ${schema.storyChunks.excerpt} || ' ' || ${schema.storyChunks.chunkText}) @@ plainto_tsquery('english', ${query})`,
            ilike(schema.storyChunks.title, searchTerm),
            ilike(schema.storyChunks.excerpt, searchTerm),
            ilike(schema.storyChunks.chunkText, searchTerm)
          )
        )
    );

    // 2. Select top ranked chunks (rn = 1 picks the single best chunk per story)
    const searchResults = await db
      .with(rankedChunks)
      .select({
        story_id: rankedChunks.storyId,
        slug: rankedChunks.slug,
        title: rankedChunks.title,
        excerpt: rankedChunks.excerpt,
        chunk_text: rankedChunks.chunkText,
        match_count: rankedChunks.matchCount,
        similarity: rankedChunks.similarity,
      })
      .from(rankedChunks)
      .where(eq(rankedChunks.rn, 1))
      .orderBy(desc(rankedChunks.matchCount), desc(rankedChunks.similarity))
      .limit(3);

    return NextResponse.json({
      query: query,
      results: searchResults
    });

  } catch (error: any) {
    console.error('Lexical search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
