drop function if exists "public"."add_url_with_config_and_snapshots"(_path text, _label text, _project_id uuid, _is_active boolean);

create table "public"."plans" (
    "id" character varying not null,
    "created_at" timestamp with time zone not null default now(),
    "pageviews_limit" integer,
    "max_websites" integer,
    "max_total_tracked_pages" integer,
    "data_retention_days" integer
);


alter table "public"."plans" enable row level security;

alter table "public"."page_config" drop column "is_active";

alter table "public"."project_config" drop column "is_active";

alter table "public"."urls" drop column "clicks";

alter table "public"."urls" drop column "views";

alter table "public"."user_profiles" drop column "data_retention_days";

alter table "public"."user_profiles" drop column "max_total_tracked_pages";

alter table "public"."user_profiles" drop column "max_websites";

alter table "public"."user_profiles" drop column "pageviews_limit";

alter table "public"."user_profiles" alter column "current_plan" set data type character varying using "current_plan"::character varying;

CREATE UNIQUE INDEX plans_pkey ON public.plans USING btree (id);

alter table "public"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_current_plan_fkey" FOREIGN KEY (current_plan) REFERENCES plans(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_current_plan_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_url_with_config_and_snapshots(_path text, _label text, _project_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public', ''
AS $function$
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

  insert into page_config (path, project_config_id, url_id)
  values (_path, _project_config_id, _url_id);

  insert into snapshots (url_id, device, label)
  values 
    (_url_id, 'desktop', now()::text),
    (_url_id, 'tablet', now()::text),
    (_url_id, 'mobile', now()::text);

  return _url_id;
end;
$function$
;

grant delete on table "public"."plans" to "anon";

grant insert on table "public"."plans" to "anon";

grant references on table "public"."plans" to "anon";

grant select on table "public"."plans" to "anon";

grant trigger on table "public"."plans" to "anon";

grant truncate on table "public"."plans" to "anon";

grant update on table "public"."plans" to "anon";

grant delete on table "public"."plans" to "authenticated";

grant insert on table "public"."plans" to "authenticated";

grant references on table "public"."plans" to "authenticated";

grant select on table "public"."plans" to "authenticated";

grant trigger on table "public"."plans" to "authenticated";

grant truncate on table "public"."plans" to "authenticated";

grant update on table "public"."plans" to "authenticated";

grant delete on table "public"."plans" to "service_role";

grant insert on table "public"."plans" to "service_role";

grant references on table "public"."plans" to "service_role";

grant select on table "public"."plans" to "service_role";

grant trigger on table "public"."plans" to "service_role";

grant truncate on table "public"."plans" to "service_role";

grant update on table "public"."plans" to "service_role";

create policy "Enable read access for all users"
on "public"."plans"
as permissive
for select
to public
using (true);



