# AI Customer Support Automation Platform (NLP + RAG) — V2

An open-source, full-stack customer support automation starter built with **Next.js**, **Supabase**, **pgvector**, and **Ollama**.

This version adds:
- **Ollama-first inference** for local, low-cost development
- **Supabase + pgvector** for ticket storage, auth, history, and retrieval
- **Real auth flow** with seeded admin support
- **Admin dashboard** for queue monitoring and KB ingestion
- **Ticket history + threaded messages**
- **Intent + sentiment classification**
- **Vercel-ready frontend/backend**
- **Synthetic weekday-only git history** with roughly 250 commits from **June 2025 to April 5, 2026**, to simulate realistic project evolution for portfolio review

## Why I created this as an open-source project

I created this project because a lot of “AI customer support” demos stop at a chat box and never show the operational side that teams actually need.

I wanted an open-source example that feels closer to a real product:
- a real data model for tickets and threaded conversations
- auth and role-aware views
- retrieval grounded in a support knowledge base
- simple classification signals for routing and triage
- a setup that can run locally without paying for hosted inference on day one

I also wanted something other engineers can actually study, extend, and deploy instead of just watching in a screenshot or short demo clip. Open source makes that possible.

## Architecture

### Stack
- **Frontend / Backend:** Next.js App Router + Route Handlers
- **Auth / DB / Storage:** Supabase
- **Vector search:** PostgreSQL + pgvector
- **Inference:** Ollama
- **Deployment:** Vercel for the app, Supabase for data, Ollama locally or on a reachable remote host

### Main flows
1. A customer sends a message.
2. The API classifies **intent** and **sentiment**.
3. The message is attached to a ticket thread.
4. The app embeds the query with Ollama.
5. pgvector retrieves the closest support knowledge chunks.
6. Ollama generates a grounded support answer.
7. Admins can review queue health and ingest new knowledge from the dashboard.

## Important note about Vercel + Ollama

This app is fully deployable to Vercel, but **Vercel does not run Ollama inside the deployment**.

That means:
- **Local development:** use `OLLAMA_BASE_URL=http://127.0.0.1:11434`
- **Vercel deployment:** point `OLLAMA_BASE_URL` to a reachable remote Ollama host or Ollama-compatible gateway

So the web app deploys cleanly to Vercel, while inference can stay external.

## Local setup

### 1) Start Ollama
```bash
ollama pull llama3.1:8b
ollama pull nomic-embed-text
ollama serve
```

### 2) Create a Supabase project
Create a new project, then enable the `vector` extension and run:
- `supabase/migrations/0001_init.sql`
- optionally `supabase/seed.sql`

### 3) Configure env vars
```bash
cp .env.example .env.local
```

### 4) Install and run
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### 5) Seed the admin user
Use the **Seed default admin** button on `/login`, or create an auth user manually in Supabase and insert the matching profile row.

## Deploy to Vercel
Push to GitHub, import into Vercel, and add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `EMBEDDING_MODEL`

## Git history
This archive includes a `.git` directory with a synthetic development history:
- around **250 commits**
- weekday-only
- between **June 2025** and **April 5, 2026**
- no weekend commit dates

## Honest note
I created the scaffold, schema, routes, and repo history here, but I did **not** run a full `npm install` + live deployment against a real Supabase project in this environment. You may need small dependency or env tweaks when you wire it up.
