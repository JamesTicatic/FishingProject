CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "species" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "species_name_unique" UNIQUE("name")
);

CREATE TABLE IF NOT EXISTS "gear" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "gear_name_unique" UNIQUE("name")
);

CREATE TABLE IF NOT EXISTS "location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "location_name_unique" UNIQUE("name")
);

CREATE TABLE IF NOT EXISTS "story_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"story_id" varchar(255) NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"species" text[],
	"gear" text[],
	"location" text,
	"date" date,
	"chunk_index" integer NOT NULL,
	"chunk_text" text NOT NULL,
	"embedding" vector(3072)
);

CREATE TABLE IF NOT EXISTS "stories_embedding" (
	"id" serial PRIMARY KEY NOT NULL,
	"story_id" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"species" text[],
	"gear" text[],
	"location" text,
	"date" date,
	"embedding" vector(3072),
	CONSTRAINT "stories_embedding_story_id_unique" UNIQUE("story_id")
);

