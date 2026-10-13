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

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  category text not null check (category in ('celulares', 'consolas', 'accesorios')),
  short_description text,
  description text,
  price numeric(12,2) not null,
  old_price numeric(12,2),
  image_url text,
  brand text,
  tag text,
  specs jsonb not null default '[]'::jsonb,
  stock integer not null default 0,
  is_active boolean not null default true,
  featured boolean not null default false
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_featured_idx on public.products (featured);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_products_updated_at();

alter table public.products enable row level security;

drop policy if exists "public_select_active_products" on public.products;
create policy "public_select_active_products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "authenticated_insert_products" on public.products;
create policy "authenticated_insert_products"
  on public.products
  for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated_update_products" on public.products;
create policy "authenticated_update_products"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated_delete_products" on public.products;
create policy "authenticated_delete_products"
  on public.products
  for delete
  to authenticated
  using (true);

alter table public.products add column if not exists brand text;
create index if not exists products_brand_idx on public.products (brand);
create index if not exists products_price_idx on public.products (price);

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do update set public = true;

drop policy if exists "public_read_productos" on storage.objects;
create policy "public_read_productos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'productos');

drop policy if exists "authenticated_insert_productos" on storage.objects;
create policy "authenticated_insert_productos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'productos');

drop policy if exists "authenticated_update_productos" on storage.objects;
create policy "authenticated_update_productos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'productos')
  with check (bucket_id = 'productos');

drop policy if exists "authenticated_delete_productos" on storage.objects;
create policy "authenticated_delete_productos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'productos');

create or replace function public.apply_products_discount(product_ids uuid[], percent numeric)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_count integer;
begin
  if product_ids is null or array_length(product_ids, 1) is null then
    raise exception 'Seleccioná al menos un producto.';
  end if;
  if percent is null or percent <= 0 or percent >= 100 then
    raise exception 'El porcentaje debe estar entre 0 y 100.';
  end if;

  update public.products
  set
    old_price = coalesce(old_price, price),
    price = round((price * (1 - percent / 100))::numeric, 2),
    tag = case when coalesce(tag, '') = '' then 'Oferta' else tag end
  where id = any(product_ids);

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

create or replace function public.bulk_update_products(
  product_ids uuid[],
  new_category text default null,
  new_is_active boolean default null
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated_count integer;
begin
  if product_ids is null or array_length(product_ids, 1) is null then
    raise exception 'Seleccioná al menos un producto.';
  end if;
  if new_category is not null and new_category not in ('celulares', 'consolas', 'accesorios') then
    raise exception 'Categoría inválida.';
  end if;
  if new_category is null and new_is_active is null then
    raise exception 'Indicá categoría o estado.';
  end if;

  update public.products
  set
    category = coalesce(new_category, category),
    is_active = coalesce(new_is_active, is_active)
  where id = any(product_ids);

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

revoke all on function public.apply_products_discount(uuid[], numeric) from public;
revoke all on function public.bulk_update_products(uuid[], text, boolean) from public;
grant execute on function public.apply_products_discount(uuid[], numeric) to authenticated;
grant execute on function public.bulk_update_products(uuid[], text, boolean) to authenticated;
