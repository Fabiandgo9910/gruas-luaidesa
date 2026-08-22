-- ============================================================
-- Grúas Luaidesa — Esquema de Supabase
-- Ejecuta este archivo en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Extensión necesaria para generar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabla principal de leads (solicitudes de servicio)
-- ------------------------------------------------------------
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  nombre         text not null,
  telefono       text not null,
  email          text,
  ciudad         text not null,
  servicio       text not null,
  mensaje        text,

  -- Trazabilidad / analítica
  origen         text,                 -- navbar | hero | contacto | sticky_mobile | flotante
  source_url     text,                 -- URL exacta desde la que se envió
  referrer       text,                 -- de dónde venía el visitante
  user_agent     text,
  ip             text,

  -- Gestión comercial (para que el CEO pueda hacer seguimiento)
  estado         text not null default 'nuevo'
                 check (estado in ('nuevo','contactado','en_curso','cerrado','descartado')),
  notas_internas text
);

comment on table public.leads is 'Solicitudes de servicio recibidas desde el formulario web de Grúas Luaidesa';

-- Índices para consultas frecuentes del panel/CRM
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_estado_idx on public.leads (estado);
create index if not exists leads_ciudad_idx on public.leads (ciudad);

-- ------------------------------------------------------------
-- Row Level Security
-- La tabla NO es pública: solo el backend (service role key) puede
-- insertar/leer. El frontend nunca toca esta tabla directamente.
-- ------------------------------------------------------------
alter table public.leads enable row level security;

-- No se define ninguna policy para "anon" ni "authenticated" a propósito:
-- sin policies, RLS bloquea todo acceso excepto el de la service_role,
-- que siempre bypasea RLS. Esto es lo más seguro para datos de clientes.

-- ------------------------------------------------------------
-- Vista simple para uso interno (opcional, útil si en el futuro
-- se conecta un panel con Supabase Auth para el equipo)
-- ------------------------------------------------------------
create or replace view public.leads_resumen as
select
  date_trunc('day', created_at) as dia,
  count(*) as total_leads,
  count(*) filter (where estado = 'nuevo') as pendientes,
  count(*) filter (where estado = 'cerrado') as cerrados
from public.leads
group by 1
order by 1 desc;
