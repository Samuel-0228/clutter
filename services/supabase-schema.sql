create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  notes text,
  completed boolean not null default false,
  category text not null default 'Work',
  due_date timestamptz,
  priority text not null default 'medium',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_position_idx on public.tasks(position);

alter table public.tasks enable row level security;

create policy "Users can read their own tasks"
on public.tasks
for select
using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
on public.tasks
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
on public.tasks
for update
using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
on public.tasks
for delete
using (auth.uid() = user_id);

create or replace function public.handle_task_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_updated_at on public.tasks;

create trigger tasks_updated_at
before update on public.tasks
for each row
execute function public.handle_task_updated_at();
