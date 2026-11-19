-- «Хроники энтузиаста»: оформление залов музея книги (этап 12). Дополнение к schema.sql и schema2.sql. Повторный запуск безопасен.
-- Нужны: public.is_admin() из schema.sql и бакет «spaces» из schema2.sql.

create table if not exists public.hall_styles(
  id text primary key check (id in ('kv','pr','id','sv','dv','ot','se','n','kl','kr','hb')),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 8000),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- кто и когда менял: ставит база, а не клиент
create or replace function public.hall_styles_touch() returns trigger language plpgsql security definer set search_path=public as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end $$;
drop trigger if exists hall_styles_touch on public.hall_styles;
create trigger hall_styles_touch before insert or update on public.hall_styles for each row execute function public.hall_styles_touch();
revoke execute on function public.hall_styles_touch() from public, anon, authenticated;

alter table public.hall_styles enable row level security;
drop policy if exists hstyle_read on public.hall_styles;
drop policy if exists hstyle_insert on public.hall_styles;
drop policy if exists hstyle_update on public.hall_styles;
drop policy if exists hstyle_delete on public.hall_styles;
create policy hstyle_read on public.hall_styles for select using (true);
create policy hstyle_insert on public.hall_styles for insert to authenticated with check (public.is_admin());
create policy hstyle_update on public.hall_styles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy hstyle_delete on public.hall_styles for delete to authenticated using (public.is_admin());

grant select on public.hall_styles to anon;
grant select, insert, update, delete on public.hall_styles to authenticated;

-- Картинки залов: бакет «spaces», папка halls/<код зала>/…  Политика вставки из schema2.sql пускает только в папку <uid>/ и (админа) в book/,
-- поэтому для halls/ нужна отдельная политика. Политики одного действия складываются через «или», прежние не меняются.
-- Замена и удаление (update/delete/select) админу уже разрешены во всём бакете политиками schema2.sql.
drop policy if exists spaces_files_halls_insert on storage.objects;
create policy spaces_files_halls_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'spaces' and (storage.foldername(name))[1] = 'halls'
  and (storage.foldername(name))[2] in ('kv','pr','id','sv','dv','ot','se','n','kl','kr','hb')
  and public.is_admin());
