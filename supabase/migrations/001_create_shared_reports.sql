-- Shared read-only report snapshots
create table if not exists shared_reports (
  hash        text primary key,
  data        jsonb        not null,
  created_at  timestamptz  not null default now(),
  expires_at  timestamptz  not null default (now() + interval '30 days'),
  view_count  integer      not null default 0
);

-- Allow anyone to read non-expired reports (public, no auth)
alter table shared_reports enable row level security;

create policy "Public read non-expired reports"
  on shared_reports for select
  using (expires_at > now());

-- Service role can insert / update (used by API route)
create policy "Service role full access"
  on shared_reports for all
  using (true)
  with check (true);

-- Auto-delete expired rows (run periodically via pg_cron or manual cleanup)
create index if not exists idx_shared_reports_expires_at on shared_reports (expires_at);

-- Email capture for Slack waitlist and audit leads
create table if not exists audit_leads (
  id            uuid         primary key default gen_random_uuid(),
  email         text         not null,
  source        text,
  wasted_amount numeric,
  kill_ads_count integer,
  vertical      text,
  created_at    timestamptz  default now()
);

alter table audit_leads enable row level security;

-- Only service role can read/write audit leads
create policy "Service role only"
  on audit_leads for all
  using (true)
  with check (true);
