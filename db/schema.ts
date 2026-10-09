import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  date,
  customType,
} from 'drizzle-orm/pg-core';

// Custom pgvector type for 3072-dimensional Gemini embeddings
export const pgVector = (name: string, dimensions: number = 3072) =>
  customType<{ data: number[]; driverData: string }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      return JSON.stringify(value);
    },
    fromDriver(value: string | number[]): number[] {
      return typeof value === 'string' ? JSON.parse(value) : value;
    },
  })(name);

// Species Table
export const species = pgTable('species', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

// Gear Table
export const gear = pgTable('gear', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

// Location Table
export const location = pgTable('location', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

// Story Chunks Table (Paragraph-level vector search)
export const storyChunks = pgTable('story_chunks', {
  id: serial('id').primaryKey(),
  storyId: varchar('story_id', { length: 255 }).notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  species: text('species').array(),
  gear: text('gear').array(),
  location: text('location'),
  date: date('date'),
  chunkIndex: integer('chunk_index').notNull(),
  chunkText: text('chunk_text').notNull(),
  embedding: pgVector('embedding', 3072),
});

// Stories Embedding Table (Full-article vector search baseline)
export const storiesEmbedding = pgTable('stories_embedding', {
  id: serial('id').primaryKey(),
  storyId: varchar('story_id', { length: 255 }).notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  species: text('species').array(),
  gear: text('gear').array(),
  location: text('location'),
  date: date('date'),
  embedding: pgVector('embedding', 3072),
});

