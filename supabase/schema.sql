-- =========================================================
--  RESTAURANT SAAS - SCHEMA COMPLETO PARA SUPABASE
--  Ejecutar en: Supabase Dashboard -> SQL Editor -> New query
-- =========================================================

-- ---------- EXTENSIONES ----------
create extension if not exists "uuid-ossp";

-- ---------- TABLA: restaurants ----------
create table if not exists public.restaurants (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,                 -- ej: "la-parrilla" -> /la-parrilla
  custom_domain text unique,                 -- opcional: dominio propio del cliente
  name text not null default 'Mi Restaurante',
  description text default '',
  meta_title text default '',
  meta_description text default '',
  logo_url text,
  favicon_url text,
  cover_url text,
  is_active boolean default true,
  theme jsonb not null default '{
    "primaryColor": "#111111",
    "secondaryColor": "#e0a458",
    "backgroundColor": "#ffffff",
    "textColor": "#111111",
    "font": "Inter",
    "radius": "1rem"
  }'::jsonb,
  socials jsonb default '{"instagram":"","facebook":"","whatsapp":"","website":""}'::jsonb,
  address text default '',
  schedule text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- TABLA: profiles (usuarios + rol) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null check (role in ('super_admin','owner')) default 'owner',
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  created_at timestamptz default now()
);

-- ---------- TABLA: sections (secciones editables de la landing) ----------
create table if not exists public.sections (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  type text not null check (type in ('hero','categories','offers','recommended','gallery','text','contact','custom')),
  title text default '',
  subtitle text default '',
  content jsonb default '{}'::jsonb,
  visible boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- TABLA: categories ----------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  visible boolean default true,
  created_at timestamptz default now()
);

-- ---------- TABLA: products ----------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text default '',
  price numeric(10,2) not null default 0,
  offer_price numeric(10,2),
  is_offer boolean default false,
  is_recommended boolean default false,
  available boolean default true,
  image_url text,
  ingredients text[] default '{}',
  allergens text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- Trigger updated_at ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_restaurants_updated on public.restaurants;
create trigger trg_restaurants_updated before update on public.restaurants
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
for each row execute procedure public.set_updated_at();

-- =========================================================
--  HELPERS DE ROL (usados en las políticas RLS)
-- =========================================================
create or replace function public.current_role_is_super_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

create or replace function public.current_user_restaurant_id()
returns uuid language sql stable as $$
  select restaurant_id from public.profiles where id = auth.uid();
$$;

-- =========================================================
--  ROW LEVEL SECURITY
-- =========================================================
alter table public.restaurants enable row level security;
alter table public.profiles enable row level security;
alter table public.sections enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- ----- restaurants -----
drop policy if exists "public read active restaurants" on public.restaurants;
create policy "public read active restaurants" on public.restaurants
  for select using (is_active = true or public.current_role_is_super_admin() or id = public.current_user_restaurant_id());

drop policy if exists "super admin all restaurants" on public.restaurants;
create policy "super admin all restaurants" on public.restaurants
  for all using (public.current_role_is_super_admin())
  with check (public.current_role_is_super_admin());

drop policy if exists "owner update own restaurant basic" on public.restaurants;
create policy "owner update own restaurant basic" on public.restaurants
  for update using (id = public.current_user_restaurant_id())
  with check (id = public.current_user_restaurant_id());

-- ----- profiles -----
drop policy if exists "user reads own profile" on public.profiles;
create policy "user reads own profile" on public.profiles
  for select using (id = auth.uid() or public.current_role_is_super_admin());

drop policy if exists "super admin manages profiles" on public.profiles;
create policy "super admin manages profiles" on public.profiles
  for all using (public.current_role_is_super_admin())
  with check (public.current_role_is_super_admin());

-- ----- sections -----
drop policy if exists "public read sections" on public.sections;
create policy "public read sections" on public.sections for select using (true);

drop policy if exists "owner/super manage sections" on public.sections;
create policy "owner/super manage sections" on public.sections
  for all using (
    public.current_role_is_super_admin() or restaurant_id = public.current_user_restaurant_id()
  )
  with check (
    public.current_role_is_super_admin() or restaurant_id = public.current_user_restaurant_id()
  );

-- ----- categories -----
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "owner/super manage categories" on public.categories;
create policy "owner/super manage categories" on public.categories
  for all using (
    public.current_role_is_super_admin() or restaurant_id = public.current_user_restaurant_id()
  )
  with check (
    public.current_role_is_super_admin() or restaurant_id = public.current_user_restaurant_id()
  );

-- ----- products -----
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (true);

drop policy if exists "owner/super manage products" on public.products;
create policy "owner/super manage products" on public.products
  for all using (
    public.current_role_is_super_admin() or restaurant_id = public.current_user_restaurant_id()
  )
  with check (
    public.current_role_is_super_admin() or restaurant_id = public.current_user_restaurant_id()
  );

-- =========================================================
--  STORAGE (bucket para imágenes públicas: logos, favicons, productos)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('restaurant-assets', 'restaurant-assets', true)
on conflict (id) do nothing;

drop policy if exists "public read restaurant-assets" on storage.objects;
create policy "public read restaurant-assets" on storage.objects
  for select using (bucket_id = 'restaurant-assets');

drop policy if exists "authenticated upload restaurant-assets" on storage.objects;
create policy "authenticated upload restaurant-assets" on storage.objects
  for insert to authenticated with check (bucket_id = 'restaurant-assets');

drop policy if exists "authenticated update own restaurant-assets" on storage.objects;
create policy "authenticated update own restaurant-assets" on storage.objects
  for update to authenticated using (bucket_id = 'restaurant-assets');

drop policy if exists "authenticated delete own restaurant-assets" on storage.objects;
create policy "authenticated delete own restaurant-assets" on storage.objects
  for delete to authenticated using (bucket_id = 'restaurant-assets');

-- =========================================================
--  TRIGGER: crear profile automáticamente al registrar usuario
--  (por defecto como 'owner' sin restaurante asignado;
--   el super_admin debe asignarle un restaurante luego)
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'owner')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
--  DATOS DE EJEMPLO (opcional, puedes borrar este bloque)
-- =========================================================
insert into public.restaurants (slug, name, description, meta_title, meta_description)
values ('demo', 'Restaurante Demo', 'Cocina de autor con ingredientes frescos de temporada.', 'Restaurante Demo | Menú', 'Descubre nuestro menú, ofertas del día y recomendaciones.')
on conflict (slug) do nothing;

-- Nota: para convertir un usuario en super_admin, después de registrarlo ejecuta:
-- update public.profiles set role = 'super_admin', restaurant_id = null where email = 'tu-email@ejemplo.com';

-- =========================================================
--  MIGRACIÓN (segura de re-ejecutar): galería de imágenes por producto,
--  y nuevo tipo de sección "daily_menu" (menú del día)
-- =========================================================

-- Varias imágenes secundarias por producto (la principal sigue siendo image_url)
alter table public.products
  add column if not exists gallery_images text[] default '{}';

-- Permitir el nuevo tipo de sección "daily_menu" en el check existente
alter table public.sections drop constraint if exists sections_type_check;
alter table public.sections
  add constraint sections_type_check
  check (type in ('hero','categories','offers','recommended','gallery','text','contact','custom','daily_menu'));
