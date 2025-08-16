drop function if exists "public"."create_url_with_config"(_project_id uuid, _path text, _label text);

alter table "public"."page_config" drop column "ignored_el";

alter table "public"."page_config" add column "exclude_el" text[];

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_url_with_config(_project_id uuid, _path text, _label text, _sensitive_element text[] DEFAULT NULL::text[], _exclude_elements text[] DEFAULT NULL::text[])
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
declare
  _tracking_id text;
  _url_id uuid;
begin
  -- Get tracking_id for the project
  select p.tracking_id into _tracking_id
  from projects p
  where p.id = _project_id;

  if _tracking_id is null then
    raise exception using errcode = 'P0001', message = 'Project not found';
  end if;

  -- Insert into urls
  insert into urls (path, label, project_id, tracking_id)
  values (_path, _label, _project_id, _tracking_id)
  returning id into _url_id;

  -- Insert into page_config
  insert into page_config (path, url_id, project_id, privacy_el, exclude_el)
  values (_path, _url_id, _project_id, _sensitive_element, _exclude_elements);

  -- Create default snapshots
  insert into snapshots (url_id, device, label)
  values 
    (_url_id, 'desktop', now()::text),
    (_url_id, 'tablet', now()::text),
    (_url_id, 'mobile', now()::text);

  return _url_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_url_and_config(_url_id uuid, _label text, _sensitive_element text[], _exclude_elements text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  -- Update urls table
  update urls 
  set 
    label = _label
  where id = _url_id;

  -- Update page_config table
  update page_config 
  set 
    privacy_el = _sensitive_element,
    exclude_el = _exclude_elements
  where url_id = _url_id;
end;
$function$
;


