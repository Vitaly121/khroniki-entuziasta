-- «Хроники энтузиаста»: этап 13 — права редактирования закреплены и «залы автора сайта». Дополнение к schema.sql, schema2.sql, schema3.sql.
-- Вставьте целиком в Supabase → SQL Editor → Run. Повторный запуск безопасен (всё через if not exists / create or replace / drop … if exists).
-- ВАЖНО: выполнить ДО публикации файлов этапа 13 (клиент, впрочем, работает и без этих полей — тогда «Добавить зал» отвечает «нет прав/ошибка»).
--
-- Модель прав (кратко, подробно — server/SPACES.md, «Кто что может»):
--   * предметы книги (obj_edits), оформление залов (hall_styles), файлы book/ и halls/ — только админ (public.is_admin()); не менялось, проверено;
--   * пространство посетителя (spaces.kind = 'visitor') создаёт и правит только его автор; любое изменение одобренного возвращает его на проверку;
--     status и note меняет только админ (автор может лишь снять одобренное с публикации — approved → pending);
--   * зал автора сайта (spaces.kind = 'hall') создаёт, правит и удаляет только админ; виден всем сразу (status = 'approved').

-- 1. Новые поля spaces: вид строки и данные зала (стыковка, картины, свет, подпись). У пространств посетителей hall = {}.
alter table public.spaces add column if not exists kind text not null default 'visitor';
alter table public.spaces add column if not exists hall jsonb not null default '{}'::jsonb;
do $$ begin
  alter table public.spaces add constraint spaces_kind_chk check (kind in ('visitor','hall'));
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.spaces add constraint spaces_hall_chk check (jsonb_typeof(hall) = 'object' and pg_column_size(hall) < 8000);
exception when duplicate_object then null; end $$;
create index if not exists spaces_kind_idx on public.spaces(kind, floor);

-- 2. Картинки в комнате посетителя — только из его собственной папки бакета (<uid>/…). Чужие пути (book/, halls/, папка другого посетителя) отвергаются.
create or replace function public.room_imgs_ok(r jsonb, folder text) returns boolean language sql immutable set search_path=public as $$
  select not exists(
    select 1 from jsonb_path_query(coalesce(r, '{}'::jsonb), 'lax $.**.img') v
    where jsonb_typeof(v) = 'string' and (v #>> '{}') <> '' and (v #>> '{}') not like (folder || '/%'))
$$;

-- 3. Страж spaces (заменяет версию из schema2.sql): владелец, id и время создания неизменны; вид строки (kind) задаётся только при создании и только админом;
--    не-админ: всегда 'visitor', hall = {}, status/note не меняет (кроме «снять с публикации»), картинки — только свои; лимиты: 3 пространства на посетителя, 40 залов автора.
create or replace function public.spaces_guard() returns trigger language plpgsql security definer set search_path=public as $$
declare adm boolean := public.is_admin();
begin
  if tg_op = 'INSERT' then
    new.owner := auth.uid();
    new.created_at := now(); new.updated_at := now();
    if not adm then
      new.status := 'pending'; new.note := ''; new.kind := 'visitor'; new.hall := '{}'::jsonb;
      if (select count(*) from public.spaces where owner = auth.uid()) >= 3 then raise exception 'limit: 3 spaces per visitor'; end if;
      if not public.room_imgs_ok(new.room, auth.uid()::text) then raise exception 'not_permitted: image path'; end if;
    else
      if new.kind = 'hall' and (select count(*) from public.spaces where kind = 'hall') >= 40 then raise exception 'limit: 40 halls'; end if;
      if new.kind <> 'hall' then new.hall := '{}'::jsonb; end if;
    end if;
    return new;
  end if;
  new.id := old.id; new.owner := old.owner; new.created_at := old.created_at; new.updated_at := now();
  new.kind := old.kind;
  if new.kind <> 'hall' then new.hall := '{}'::jsonb; end if;
  if not adm then
    new.note := old.note; new.hall := old.hall;
    if not public.room_imgs_ok(new.room, old.owner::text) then raise exception 'not_permitted: image path'; end if;
    if new.title is distinct from old.title or new.descr is distinct from old.descr or new.room is distinct from old.room or new.floor is distinct from old.floor then
      new.status := 'pending';
    elsif new.status = 'pending' and old.status = 'approved' then
      null; -- автор сам снимает одобренное с публикации
    else
      new.status := old.status;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists spaces_guard on public.spaces;
create trigger spaces_guard before insert or update on public.spaces for each row execute function public.spaces_guard();
revoke execute on function public.spaces_guard() from public, anon, authenticated;

-- 4. Страж предметов (заменяет версию из schema2.sql): id, владелец и пространство неизменны; картинка не-админа — только из своей папки; 24 предмета.
create or replace function public.space_objects_guard() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op = 'INSERT' then
    new.owner := auth.uid();
    if (select count(*) from public.space_objects where space = new.space) >= 24 then raise exception 'limit: 24 objects per space'; end if;
  else
    new.id := old.id; new.owner := old.owner; new.space := old.space;
  end if;
  new.updated_at := now();
  if not public.is_admin() then
    if new.img <> '' and new.img not like (auth.uid()::text || '/%') then raise exception 'not_permitted: image path'; end if;
    update public.spaces set status = 'pending', updated_at = now() where id = new.space and status = 'approved';
  end if;
  return new;
end $$;
drop trigger if exists space_objects_guard on public.space_objects;
create trigger space_objects_guard before insert or update on public.space_objects for each row execute function public.space_objects_guard();
revoke execute on function public.space_objects_guard() from public, anon, authenticated;

-- 5. Политики spaces: прежние (schema2.sql) уже требуют «автор или админ» для update/delete и пускают insert только вошедшим;
--    дублируем их здесь, чтобы файл был самодостаточен и порядок запуска не имел значения.
alter table public.spaces enable row level security;
drop policy if exists spaces_read on public.spaces;
drop policy if exists spaces_insert on public.spaces;
drop policy if exists spaces_update on public.spaces;
drop policy if exists spaces_delete on public.spaces;
create policy spaces_read on public.spaces for select using (status = 'approved' or owner = auth.uid() or public.is_admin());
create policy spaces_insert on public.spaces for insert to authenticated with check (kind = 'visitor' or public.is_admin());
create policy spaces_update on public.spaces for update to authenticated using (owner = auth.uid() or public.is_admin()) with check (owner = auth.uid() or public.is_admin());
create policy spaces_delete on public.spaces for delete to authenticated using (owner = auth.uid() or public.is_admin());

grant select on public.spaces to anon;
grant select, insert, update, delete on public.spaces to authenticated;

-- Проверка после запуска (необязательно): у пространств посетителей kind = 'visitor', hall = {}.
-- select kind, count(*) from public.spaces group by kind;
