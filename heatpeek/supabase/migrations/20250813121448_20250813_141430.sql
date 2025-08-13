drop policy "Enable delete only if user owns the project" on "public"."project_config";

drop policy "Enable insert only if user owns the project" on "public"."project_config";

drop policy "Enable read access for all users" on "public"."project_config";

drop policy "Enable update only if user owns the project" on "public"."project_config";

revoke delete on table "public"."project_config" from "anon";

revoke insert on table "public"."project_config" from "anon";

revoke references on table "public"."project_config" from "anon";

revoke select on table "public"."project_config" from "anon";

revoke trigger on table "public"."project_config" from "anon";

revoke truncate on table "public"."project_config" from "anon";

revoke update on table "public"."project_config" from "anon";

revoke delete on table "public"."project_config" from "authenticated";

revoke insert on table "public"."project_config" from "authenticated";

revoke references on table "public"."project_config" from "authenticated";

revoke select on table "public"."project_config" from "authenticated";

revoke trigger on table "public"."project_config" from "authenticated";

revoke truncate on table "public"."project_config" from "authenticated";

revoke update on table "public"."project_config" from "authenticated";

revoke delete on table "public"."project_config" from "service_role";

revoke insert on table "public"."project_config" from "service_role";

revoke references on table "public"."project_config" from "service_role";

revoke select on table "public"."project_config" from "service_role";

revoke trigger on table "public"."project_config" from "service_role";

revoke truncate on table "public"."project_config" from "service_role";

revoke update on table "public"."project_config" from "service_role";

alter table "public"."page_config" drop constraint "page_config_project_config_id_fkey";

alter table "public"."project_config" drop constraint "config_tracking_id_fkey";

alter table "public"."project_config" drop constraint "project_config_project_id_fkey";

alter table "public"."project_config" drop constraint "project_config_project_id_key";

alter table "public"."project_config" drop constraint "project_config_tracking_id_key";

drop function if exists "public"."add_url_with_config_and_snapshots"(_path text, _label text, _project_id uuid);

alter table "public"."project_config" drop constraint "config_pkey";

drop index if exists "public"."config_pkey";

drop index if exists "public"."config_tracking_id_idx";

drop index if exists "public"."page_config_project_path_idx";

drop index if exists "public"."project_config_project_id_key";

drop index if exists "public"."project_config_tracking_id_key";

drop table "public"."project_config";

alter table "public"."page_config" drop column "project_config_id";

alter table "public"."page_config" add column "project_id" uuid not null;

alter table "public"."projects" add column "is_active" boolean not null default true;

alter table "public"."projects" add column "usage_exceeded" boolean not null default false;

alter table "public"."page_config" add constraint "page_config_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."page_config" validate constraint "page_config_project_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_url_with_config(_project_id uuid, _path text, _label text)
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
  insert into page_config (path, url_id, project_id)
  values (_path, _url_id, _project_id);

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


