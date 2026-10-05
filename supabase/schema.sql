-- Ejecutar en el SQL Editor de Supabase si todavía no existe la tabla.

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  device_type text not null,
  brand_model text,
  description text not null,
  photos text[] not null default '{}',
  status text not null default 'nuevo' check (status in ('nuevo', 'en_proceso', 'cerrado'))
);

alter table public.service_requests enable row level security;

drop policy if exists "anon_insert_service_requests" on public.service_requests;
create policy "anon_insert_service_requests"
  on public.service_requests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "no_public_select_service_requests" on public.service_requests;
-- Sin policy de SELECT para anon: las consultas no se leen desde el sitio público.
