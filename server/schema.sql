-- «Хроники энтузиаста»: база сайта. Вставьте целиком в Supabase → SQL Editor → Run. Повторный запуск безопасен.

create table if not exists public.docs(
  path text primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 32)
);
create table if not exists public.admins(id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.usage(
  id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  n int not null default 0,
  primary key(id, day)
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from public.admins where id = auth.uid()) $$;

-- счётчик ответов двойников: Worker вызывает его от имени посетителя перед каждым ответом
create or replace function public.bump_usage() returns int language plpgsql security definer set search_path=public as $$
declare c int;
begin
  if auth.uid() is null then raise exception 'no user'; end if;
  insert into public.usage(id, day, n) values (auth.uid(), current_date, 1)
    on conflict (id, day) do update set n = public.usage.n + 1 returning n into c;
  return c;
end $$;
revoke all on function public.bump_usage() from public, anon;
grant execute on function public.bump_usage() to authenticated;

alter table public.docs enable row level security;
alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.usage enable row level security;

drop policy if exists docs_read on public.docs;
drop policy if exists docs_insert on public.docs;
drop policy if exists docs_update on public.docs;
drop policy if exists docs_delete on public.docs;
-- читать клуб, залы и следы могут все; личный прогресс — только хозяин
create policy docs_read on public.docs for select using (path like 'traces/%' or owner = auth.uid());
-- писать каждый может только в свой документ, размером до 400 КБ
create policy docs_insert on public.docs for insert to authenticated with check (
  owner = auth.uid()
  and path in ('traces/' || auth.uid()::text, 'data/users/' || auth.uid()::text || '/progress')
  and pg_column_size(data) < 400000);
create policy docs_update on public.docs for update to authenticated
  using (owner = auth.uid() or public.is_admin())
  with check (pg_column_size(data) < 400000);
create policy docs_delete on public.docs for delete to authenticated using (owner = auth.uid() or public.is_admin());

drop policy if exists profiles_read on public.profiles;
drop policy if exists profiles_write on public.profiles;
drop policy if exists profiles_update on public.profiles;
create policy profiles_read on public.profiles for select using (true);
create policy profiles_write on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins for select to authenticated using (id = auth.uid());
-- таблица usage закрыта: её меняет только функция bump_usage

-- владелец строки не может переписать поле owner
create or replace function public.docs_keep_owner() returns trigger language plpgsql as
$$ begin new.owner := old.owner; new.path := old.path; new.updated_at := now(); return new; end $$;
drop trigger if exists docs_keep_owner on public.docs;
create trigger docs_keep_owner before update on public.docs for each row execute function public.docs_keep_owner();

-- живые обновления клуба и следов
do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when duplicate_object then null; end $$;

-- ПОСЛЕ того как вы сами зарегистрируетесь на сайте, сделайте себя владельцем (подставьте свою почту):
-- insert into public.admins(id) select id from auth.users where email = 'ваша@почта' on conflict do nothing;
