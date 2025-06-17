create or replace function add_url_with_config_and_snapshots(
  _path text,
  _label text,
  _project_id uuid,
  _is_active boolean
)
returns uuid
language plpgsql
SET search_path = 'public', ''
as $$
declare
  _tracking_id text;
  _project_config_id uuid;
  _url_id uuid;
begin
  select p.tracking_id into _tracking_id
  from projects p
  where p.id = _project_id;

  if _tracking_id is null then
    raise exception using errcode = 'P0001';
  end if;

  select pc.id into _project_config_id
  from project_config pc
  where pc.project_id = _project_id;

  if _project_config_id is null then
    raise exception using errcode = 'P0001';
  end if;

  insert into urls (path, label, project_id, tracking_id)
  values (_path, _label, _project_id, _tracking_id)
  returning id into _url_id;

  insert into page_config (path, is_active, project_config_id, url_id)
  values (_path, _is_active, _project_config_id, _url_id);

  insert into snapshots (url_id, device, label)
  values 
    (_url_id, 'desktop', now()::text),
    (_url_id, 'tablet', now()::text),
    (_url_id, 'mobile', now()::text);

  return _url_id;
end;
$$