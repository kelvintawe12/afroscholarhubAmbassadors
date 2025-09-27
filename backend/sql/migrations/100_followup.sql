create table followups (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid references schools(id),
  followup_date date not null,
  notes text,
  created_at timestamp default now()
);