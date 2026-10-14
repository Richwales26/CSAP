-- CSAP schema v0.1 (Phase 3-4). Run: psql $DATABASE_URL -f src/schema.sql
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  created_at timestamptz default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) on delete cascade,
  vin text not null,
  name text not null default 'My car',
  link_type text not null default 'unknown',
  created_at timestamptz default now()
);

create table if not exists vehicle_capabilities (
  vehicle_id uuid references vehicles(id) on delete cascade,
  feature text not null,
  state text not null check (state in ('supported','unsupported','unverified')),
  primary key (vehicle_id, feature)
);

create table if not exists trusted_grants (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  can_drive boolean default false,
  can_see_spot boolean default false,
  ends_at timestamptz
);

create table if not exists modes (
  vehicle_id uuid primary key references vehicles(id) on delete cascade,
  mode text not null default 'everyday'
);

create table if not exists locations (
  id bigserial primary key,
  vehicle_id uuid references vehicles(id) on delete cascade,
  lat double precision not null,
  lon double precision not null,
  at timestamptz default now(),
  fresh text not null default 'unknown'
);
create index if not exists idx_locations_vehicle_at on locations(vehicle_id, at desc);

create table if not exists events (
  id bigserial primary key,
  vehicle_id uuid references vehicles(id) on delete cascade,
  kind text not null,
  fact_or_guess text not null default 'fact',
  at timestamptz default now()
);

create table if not exists alerts (
  id bigserial primary key,
  vehicle_id uuid references vehicles(id) on delete cascade,
  kind text not null,
  rank text not null default 'routine',
  state text not null default 'unsure',
  at timestamptz default now()
);

create table if not exists audit_log (
  id bigserial primary key,
  who uuid,
  what text not null,
  at timestamptz default now()
);
