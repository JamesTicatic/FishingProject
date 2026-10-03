# 🎣 Cast & Catch Stories | The Angler's Field Journal & Search Lab

My personal fishing blog making use of a **search comparison laboratory**. Built with Next.js App Router, Tailwind CSS, Google Gemini Embeddings (`gemini-embedding-2`), and PostgreSQL with `pgvector` hosted on Neon Serverless. Don't forget to read the stories! They are written with love.

---

## 🌟 Features

### 📖 The Angler's Field Journal
* **Interactive Story Grid**: Filter narratives live by **Species**, **Gear Used**, and **Location** without triggering server reloads.
* **Newest-First Ordering**: Automatic date-descending sort so the freshest catches always stay top of mind.
* **True-to-Size Photography**: High-resolution, uncropped field photos displaying exact aspect ratios. Instead of storing heavy image binaries in PostgreSQL (which inflates database size), the app only stores lightweight URL strings for images hosted in Vercel Blob Object Storage.
* **Pagination**: Grid pagination limiting display to 6 stories per page for clean browsing.

### 🔬 Search Comparison Dashboard (`/dashboard`)
An interactive benchmark lab comparing three different retrieval paradigms side-by-side in real time:
1. **Lexical / Keyword Search (`/api/search-lexical`)**: Traditional text search using PostgreSQL `tsvector` and `ILIKE`. Counts exact keyword occurrences across stories.
2. **Chunked Paragraph Vector Search (`/api/search`)**: Splitting stories into paragraph chunks to prevent semantic dilution and pinpoint fine details.
3. **Full-Article Vector Search (`/api/search-full`)**: Baseline model embedding the entire story narrative into a single vector, capturing average semantic meaning.

### 🛡️ Production & Security Safeguards
* **In-Memory Rate Limiter (`lib/rate-limit.ts`)**: Throttles API access to **60 requests per minute per IP**, protecting Gemini API quotas and database connection pools from bot abuse.

---

## 🛠️ Architecture & Tech Stack

* **Framework**: Next.js (App Router, Server Components & Client Components)
* **Styling**: Tailwind CSS
* **Database**: PostgreSQL with `pgvector` extension (Neon Serverless)
* **AI Embeddings**: Google Gemini API (`gemini-embedding-2`, 3072-dimension vectors)
* **Analytics**: Vercel Analytics (`@vercel/analytics`)
* **Language**: TypeScript

---

## 📡 API Endpoint Reference

| Route | Method | Description | Responses |
| :--- | :--- | :--- | :--- |
| `/api/search` | `GET` | Vector search over paragraph chunks using `pgvector` | • `200 OK`: `{ query, results: [{ story_id, title, excerpt, chunk_text, similarity }] }`<br>• `429 Too Many Requests`: `{ error }`<br>• `500 Server Error`: `{ error }` |
| `/api/search-full` | `GET` | Vector search over full story narratives (baseline) | • `200 OK`: `{ query, results: [{ story_id, title, excerpt, similarity }] }`<br>• `429 Too Many Requests`: `{ error }`<br>• `500 Server Error`: `{ error }` |
| `/api/search-lexical` | `GET` | Full-Text Lexical (Keyword) search with occurrence counting | • `200 OK`: `{ query, results: [{ story_id, title, excerpt, chunk_text, match_count }] }`<br>• `429 Too Many Requests`: `{ error }`<br>• `500 Server Error`: `{ error }` |
| `/api/ingest` | `GET` | Drops & recreates `story_chunks` table and embeds story paragraphs | • `200 OK`: `{ success: true, message }`<br>• `429 Too Many Requests`: `{ error }`<br>• `500 Server Error`: `{ error }` |
| `/api/ingest-full` | `GET` | Drops & recreates `stories_embedding` table and embeds full stories | • `200 OK`: `{ success: true, message }`<br>• `429 Too Many Requests`: `{ error }`<br>• `500 Server Error`: `{ error }` |

---

## 🔮 Future Architectural Roadmap

Here are enterprise backend architectural patterns to introduce as the platform scales:

  
### 1. A/B Testing Search Algorithms
* **Concept**: Split search traffic or compare multi-retrieval performance metrics (Lexical vs. Chunked Vector vs. Full Vector) in production.
* **Tech**: PostHog, LaunchDarkly, or custom feature flags.
* **Benefit**: Scientifically validates which search methodology delivers the highest relevance and user engagement.

### 2. Relevance Feedback Loops & Click Analytics
* **Concept**: Track search result selection events when users click an article to read after searching, building an implicit feedback loop.
* **Tech**: Analytics event tracking (PostHog/Mixpanel) + Learning to Rank (LTR) / Hybrid Re-ranking.
* **Benefit**: Measures Click-Through Rates (CTR) and user dwell time to automatically re-rank search results and fine-tune vector similarity thresholds based on real user behavior.


### 3. Asynchronous Job Queues (Background Workers)
* **Concept**: Offload heavy tasks (like generating embeddings for 100+ new stories) out of the HTTP request loop.
* **Tech**: Redis + BullMQ or AWS SQS.
* **Benefit**: Long ingestion scripts return an immediate `202 Accepted` status to the client while background workers process data without hitting 15-second serverless HTTP timeouts.

### 4. In-Memory Caching Layer
* **Concept**: Cache frequent or identical search queries.
* **Tech**: Upstash Redis or Redis Cloud.
* **Benefit**: If 100 users search for `"red drum"`, the first query hits Gemini and Postgres, while the remaining 99 are served instantly from Redis in < 2ms, saving API costs and database compute.

### 5. Strict API Input Validation
* **Concept**: Validate and sanitize all incoming request parameters before executing any queries.
* **Tech**: Zod or TypeBox schemas.
* **Benefit**: Rejects malformed requests or injection attempts at the API boundary before hitting business logic.

### 6. Authentication & Role-Based Access Control (RBAC)
* **Concept**: Protect administrative endpoints.
* **Tech**: NextAuth.js (Auth.js) or Clerk.
* **Benefit**: Ensures public users can execute searches while strictly restricting data ingestion (`/api/ingest`) to authenticated administrators.

### 7. Database Schema Version Control & Migrations
* **Concept**: Incremental tracking of database changes.
* **Tech**: Drizzle Kit or Prisma Migrate.
* **Benefit**: Allows schema updates (adding columns, indexes) in live production environments without resorting to destructive `DROP TABLE IF EXISTS` commands.

### 8. Production Observability & Application Performance Monitoring (APM)
* **Concept**: Real-time error tracking and query performance tracing.
* **Tech**: Sentry, Datadog, or OpenTelemetry.
* **Benefit**: Automatically alerts engineers with exact stack traces and user context when an API route fails in production.


