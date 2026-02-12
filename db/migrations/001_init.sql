create extension if not exists "pgcrypto";

create table if not exists bartender_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  photo_url text,
  hourly_rate numeric not null check (hourly_rate >= 0),
  travel_radius_mi integer not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  host_name text not null,
  host_email text not null,
  host_phone text not null,
  event_date date not null,
  start_time time not null,
  hours integer not null,
  guest_count integer not null,
  address text not null,
  city text not null,
  notes text,
  add_ons jsonb not null default '[]'::jsonb,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null references booking_requests(id) on delete cascade,
  bartender_profile_id uuid not null references bartender_profiles(id),
  status text not null default 'assigned',
  deposit_amount numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  type text not null check (type in ('deposit', 'tip')),
  stripe_session_id text not null,
  amount numeric not null,
  currency text not null default 'usd',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists idx_requests_created_at on booking_requests(created_at desc);
create index if not exists idx_bookings_request on bookings(booking_request_id);
create index if not exists idx_payments_booking on payments(booking_id);
create index if not exists idx_payments_session on payments(stripe_session_id);

alter table booking_requests enable row level security;
create policy "public insert requests" on booking_requests
  for insert
  to anon
  with check (true);

create policy "no public read requests" on booking_requests
  for select
  to anon
  using (false);
