-- «Хроники энтузиаста»: пространства посетителей и правка предметов. Дополнение к schema.sql. Повторный запуск безопасен.

create table if not exists public.spaces(
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  floor text not null check (floor in ('551','43','17','-1')),
  title text not null check (char_length(title) between 1 and 60),
  descr text not null default '' check (char_length(descr) <= 600),
  room jsonb not null default '{}'::jsonb check (pg_column_size(room) < 4000),
  status text not null default 'pending' check (status in ('pending','approved','hidden')),
  note text not null default '' check (char_length(note) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists spaces_floor_idx on public.spaces(floor, status);

create table if not exists public.space_objects(
  id uuid primary key default gen_random_uuid(),
  space uuid not null references public.spaces(id) on delete cascade,
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  descr text not null default '' check (char_length(descr) <= 1200),
  img text not null default '' check (char_length(img) <= 300),
  place jsonb not null default '{}'::jsonb check (pg_column_size(place) < 1000),
  sort int not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists space_objects_space_idx on public.space_objects(space);

create table if not exists public.obj_edits(
  id text primary key check (char_length(id) <= 40),
  data jsonb not null check (pg_column_size(data) < 8000),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create or replace function public.space_visible(sid uuid) returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from public.spaces s where s.id = sid and (s.status = 'approved' or s.owner = auth.uid() or public.is_admin())) $$;
create or replace function public.space_mine(sid uuid) returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from public.spaces s where s.id = sid and (s.owner = auth.uid() or public.is_admin())) $$;

create or replace function public.spaces_guard() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op = 'INSERT' then
    new.owner := auth.uid();
    if not public.is_admin() then
      new.status := 'pending'; new.note := '';
      if (select count(*) from public.spaces where owner = auth.uid()) >= 3 then raise exception 'limit: 3 spaces per visitor'; end if;
    end if;
    return new;
  end if;
  new.owner := old.owner; new.created_at := old.created_at; new.updated_at := now();
  if not public.is_admin() then
    new.note := old.note;
    if new.title is distinct from old.title or new.descr is distinct from old.descr or new.room is distinct from old.room or new.floor is distinct from old.floor then
      new.status := 'pending';
    elsif new.status <> 'pending' then
      new.status := old.status;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists spaces_guard on public.spaces;
create trigger spaces_guard before insert or update on public.spaces for each row execute function public.spaces_guard();

create or replace function public.space_objects_guard() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op = 'INSERT' then
    new.owner := auth.uid();
    if (select count(*) from public.space_objects where space = new.space) >= 24 then raise exception 'limit: 24 objects per space'; end if;
  else
    new.owner := old.owner; new.space := old.space;
  end if;
  new.updated_at := now();
  if not public.is_admin() then
    update public.spaces set status = 'pending', updated_at = now() where id = new.space and status = 'approved';
  end if;
  return new;
end $$;
drop trigger if exists space_objects_guard on public.space_objects;
create trigger space_objects_guard before insert or update on public.space_objects for each row execute function public.space_objects_guard();

alter table public.spaces enable row level security;
alter table public.space_objects enable row level security;
alter table public.obj_edits enable row level security;

drop policy if exists spaces_read on public.spaces;
drop policy if exists spaces_insert on public.spaces;
drop policy if exists spaces_update on public.spaces;
drop policy if exists spaces_delete on public.spaces;
create policy spaces_read on public.spaces for select using (status = 'approved' or owner = auth.uid() or public.is_admin());
create policy spaces_insert on public.spaces for insert to authenticated with check (true);
create policy spaces_update on public.spaces for update to authenticated using (owner = auth.uid() or public.is_admin()) with check (true);
create policy spaces_delete on public.spaces for delete to authenticated using (owner = auth.uid() or public.is_admin());

drop policy if exists sobj_read on public.space_objects;
drop policy if exists sobj_insert on public.space_objects;
drop policy if exists sobj_update on public.space_objects;
drop policy if exists sobj_delete on public.space_objects;
create policy sobj_read on public.space_objects for select using (public.space_visible(space));
create policy sobj_insert on public.space_objects for insert to authenticated with check (public.space_mine(space));
create policy sobj_update on public.space_objects for update to authenticated using (public.space_mine(space)) with check (public.space_mine(space));
create policy sobj_delete on public.space_objects for delete to authenticated using (public.space_mine(space));

drop policy if exists oedit_read on public.obj_edits;
drop policy if exists oedit_insert on public.obj_edits;
drop policy if exists oedit_update on public.obj_edits;
drop policy if exists oedit_delete on public.obj_edits;
create policy oedit_read on public.obj_edits for select using (true);
create policy oedit_insert on public.obj_edits for insert to authenticated with check (public.is_admin());
create policy oedit_update on public.obj_edits for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy oedit_delete on public.obj_edits for delete to authenticated using (public.is_admin());

grant select on public.spaces, public.space_objects, public.obj_edits to anon;
grant select, insert, update, delete on public.spaces, public.space_objects, public.obj_edits to authenticated;
revoke execute on function public.spaces_guard() from public, anon, authenticated;
revoke execute on function public.space_objects_guard() from public, anon, authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
  values ('spaces', 'spaces', true, 2097152, array['image/webp','image/jpeg','image/png'])
  on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/webp','image/jpeg','image/png'];

drop policy if exists spaces_files_insert on storage.objects;
drop policy if exists spaces_files_update on storage.objects;
drop policy if exists spaces_files_delete on storage.objects;
create policy spaces_files_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'spaces' and ((storage.foldername(name))[1] = auth.uid()::text or ((storage.foldername(name))[1] = 'book' and public.is_admin())));
create policy spaces_files_update on storage.objects for update to authenticated using (
  bucket_id = 'spaces' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy spaces_files_delete on storage.objects for delete to authenticated using (
  bucket_id = 'spaces' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- дополнение 18.11: чтение своих файлов (нужно для удаления) и возврат на проверку при удалении предмета
drop policy if exists spaces_files_select on storage.objects;
create policy spaces_files_select on storage.objects for select to authenticated using (
  bucket_id = 'spaces' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create or replace function public.space_objects_del_guard() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not public.is_admin() then
    update public.spaces set status = 'pending', updated_at = now() where id = old.space and status = 'approved';
  end if;
  return old;
end $$;
drop trigger if exists space_objects_del_guard on public.space_objects;
create trigger space_objects_del_guard after delete on public.space_objects for each row execute function public.space_objects_del_guard();
revoke execute on function public.space_objects_del_guard() from public, anon, authenticated;
