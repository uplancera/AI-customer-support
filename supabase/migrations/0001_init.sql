create extension if not exists vector;

create table if not exists public.profiles (
  id uuid primary key,
  email text unique not null,
  full_name text,
  role text not null default 'agent' check (role in ('admin', 'agent')),
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  customer_email text not null,
  status text not null default 'open' check (status in ('open', 'pending', 'resolved')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  sentiment text not null default 'neutral' check (sentiment in ('positive', 'neutral', 'negative')),
  intent text not null default 'general' check (intent in ('billing', 'technical_support', 'refund', 'feature_request', 'account_access', 'general')),
  created_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ticket_feedback (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  score int not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null default 'manual',
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  title text not null,
  content text not null,
  embedding vector(768),
  created_at timestamptz not null default now()
);

create index if not exists knowledge_chunks_embedding_idx on public.knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function public.match_knowledge_chunks(query_embedding vector(768), match_count int default 4)
returns table (id uuid, title text, content text, similarity float)
language sql
as $$
  select knowledge_chunks.id, knowledge_chunks.title, knowledge_chunks.content, 1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks
  order by knowledge_chunks.embedding <=> query_embedding
  limit match_count;
$$;

alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.ticket_feedback enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;

create policy "profiles selectable by authenticated users" on public.profiles for select to authenticated using (true);
create policy "tickets selectable by authenticated users" on public.tickets for select to authenticated using (true);
create policy "ticket_messages selectable by authenticated users" on public.ticket_messages for select to authenticated using (true);
create policy "feedback selectable by authenticated users" on public.ticket_feedback for select to authenticated using (true);
create policy "knowledge selectable by authenticated users" on public.knowledge_documents for select to authenticated using (true);
create policy "knowledge chunks selectable by authenticated users" on public.knowledge_chunks for select to authenticated using (true);
