create type "public"."device" as enum ('desktop', 'tablet', 'mobile');

create table "public"."page_config" (
    "created_at" timestamp with time zone not null default now(),
    "path" text not null,
    "ignored_el" text[],
    "privacy_el" text[],
    "project_config_id" uuid not null,
    "id" uuid not null default gen_random_uuid(),
    "url_id" uuid not null,
    "is_active" boolean not null default true,
    "update_snap_desktop" boolean not null default true,
    "update_snap_tablet" boolean not null default true,
    "update_snap_mobile" boolean not null default true
);


alter table "public"."page_config" enable row level security;

create table "public"."project_config" (
    "created_at" timestamp with time zone not null default now(),
    "usageExceeded" boolean not null default false,
    "id" uuid not null default gen_random_uuid(),
    "tracking_id" character varying not null,
    "is_active" boolean not null default true,
    "project_id" uuid not null
);


alter table "public"."project_config" enable row level security;

create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "label" text,
    "base_url" text not null,
    "type" text,
    "user_id" uuid not null default auth.uid(),
    "tracking_id" character varying not null
);


alter table "public"."projects" enable row level security;

create table "public"."snapshots" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "label" text,
    "dom_data" text,
    "layout_hash" text,
    "screenshot_url" text,
    "width" smallint,
    "height" integer,
    "user_id" uuid not null default auth.uid(),
    "total_clicks" integer not null default 0,
    "last_processed_at" timestamp without time zone not null default now(),
    "should_update" boolean not null default true,
    "is_outdated" boolean not null default false,
    "url_id" uuid not null,
    "device" device not null
);


alter table "public"."snapshots" enable row level security;

create table "public"."subscription_limits" (
    "id" uuid not null default gen_random_uuid(),
    "subscription_id" text,
    "type" text,
    "value" integer
);


create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "stripe_subscription_id" text,
    "stripe_customer_id" text,
    "price_id" text,
    "status" text,
    "current_period_start" timestamp without time zone,
    "current_period_end" timestamp without time zone,
    "cancel_at_period_end" boolean,
    "updated_at" timestamp without time zone,
    "trial_end" timestamp without time zone
);


create table "public"."urls" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "path" text not null,
    "label" text,
    "project_id" uuid not null,
    "tracking_id" character varying not null,
    "user_id" uuid not null default auth.uid(),
    "views" bigint not null default '0'::bigint,
    "clicks" bigint not null default '0'::bigint
);


alter table "public"."urls" enable row level security;

create table "public"."user_profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "stripe_customer_id" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_profiles" enable row level security;

CREATE UNIQUE INDEX config_pkey ON public.project_config USING btree (id);

CREATE INDEX config_tracking_id_idx ON public.project_config USING btree (tracking_id);

CREATE UNIQUE INDEX page_config_pkey ON public.page_config USING btree (id);

CREATE INDEX page_config_project_path_idx ON public.page_config USING btree (project_config_id, path);

CREATE UNIQUE INDEX page_config_url_id_key ON public.page_config USING btree (url_id);

CREATE UNIQUE INDEX project_config_project_id_key ON public.project_config USING btree (project_id);

CREATE UNIQUE INDEX project_config_tracking_id_key ON public.project_config USING btree (tracking_id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX projects_tracking_id_key ON public.projects USING btree (tracking_id);

CREATE UNIQUE INDEX projects_user_id_base_url_key ON public.projects USING btree (user_id, base_url);

CREATE UNIQUE INDEX snapshots_pkey ON public.snapshots USING btree (id);

CREATE UNIQUE INDEX subscription_limits_pkey ON public.subscription_limits USING btree (id);

CREATE UNIQUE INDEX subscription_limits_subscription_id_type_key ON public.subscription_limits USING btree (subscription_id, type);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);

CREATE UNIQUE INDEX urls_pkey ON public.urls USING btree (id);

CREATE UNIQUE INDEX urls_project_path_unique ON public.urls USING btree (project_id, path);

CREATE UNIQUE INDEX user_profiles_email_key ON public.user_profiles USING btree (email);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX user_profiles_stripe_customer_id_key ON public.user_profiles USING btree (stripe_customer_id);

alter table "public"."page_config" add constraint "page_config_pkey" PRIMARY KEY using index "page_config_pkey";

alter table "public"."project_config" add constraint "config_pkey" PRIMARY KEY using index "config_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."snapshots" add constraint "snapshots_pkey" PRIMARY KEY using index "snapshots_pkey";

alter table "public"."subscription_limits" add constraint "subscription_limits_pkey" PRIMARY KEY using index "subscription_limits_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."urls" add constraint "urls_pkey" PRIMARY KEY using index "urls_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."page_config" add constraint "page_config_project_config_id_fkey" FOREIGN KEY (project_config_id) REFERENCES project_config(id) ON DELETE CASCADE not valid;

alter table "public"."page_config" validate constraint "page_config_project_config_id_fkey";

alter table "public"."page_config" add constraint "page_config_url_id_fkey" FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE not valid;

alter table "public"."page_config" validate constraint "page_config_url_id_fkey";

alter table "public"."page_config" add constraint "page_config_url_id_key" UNIQUE using index "page_config_url_id_key";

alter table "public"."project_config" add constraint "config_tracking_id_fkey" FOREIGN KEY (tracking_id) REFERENCES projects(tracking_id) ON DELETE CASCADE not valid;

alter table "public"."project_config" validate constraint "config_tracking_id_fkey";

alter table "public"."project_config" add constraint "project_config_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."project_config" validate constraint "project_config_project_id_fkey";

alter table "public"."project_config" add constraint "project_config_project_id_key" UNIQUE using index "project_config_project_id_key";

alter table "public"."project_config" add constraint "project_config_tracking_id_key" UNIQUE using index "project_config_tracking_id_key";

alter table "public"."projects" add constraint "projects_tracking_id_key" UNIQUE using index "projects_tracking_id_key";

alter table "public"."projects" add constraint "projects_user_id_base_url_key" UNIQUE using index "projects_user_id_base_url_key";

alter table "public"."projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_user_id_fkey";

alter table "public"."snapshots" add constraint "snapshots_url_id_fkey" FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE not valid;

alter table "public"."snapshots" validate constraint "snapshots_url_id_fkey";

alter table "public"."snapshots" add constraint "snapshots_userId_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."snapshots" validate constraint "snapshots_userId_fkey";

alter table "public"."subscription_limits" add constraint "subscription_limits_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(stripe_subscription_id) ON DELETE CASCADE not valid;

alter table "public"."subscription_limits" validate constraint "subscription_limits_subscription_id_fkey";

alter table "public"."subscription_limits" add constraint "subscription_limits_subscription_id_type_key" UNIQUE using index "subscription_limits_subscription_id_type_key";

alter table "public"."subscriptions" add constraint "subscriptions_stripe_subscription_id_key" UNIQUE using index "subscriptions_stripe_subscription_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."urls" add constraint "urls_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."urls" validate constraint "urls_project_id_fkey";

alter table "public"."urls" add constraint "urls_project_path_unique" UNIQUE using index "urls_project_path_unique";

alter table "public"."urls" add constraint "urls_tracking_id_fkey" FOREIGN KEY (tracking_id) REFERENCES projects(tracking_id) not valid;

alter table "public"."urls" validate constraint "urls_tracking_id_fkey";

alter table "public"."urls" add constraint "urls_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."urls" validate constraint "urls_user_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_email_key" UNIQUE using index "user_profiles_email_key";

alter table "public"."user_profiles" add constraint "user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_stripe_customer_id_key" UNIQUE using index "user_profiles_stripe_customer_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.upsert_aggregated_clicks(clicks jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$begin
  insert into aggregated_clicks ("snapshot_id", "grid_x", "grid_y", "count", "last_updated_at")
  select
    (value->>'snapshot_id')::uuid,
    (value->>'grid_x')::int,
    (value->>'grid_y')::int,
    (value->>'count')::int,
    (value->>'last_updated_at')::timestamp
  from jsonb_array_elements(clicks) as value
  on conflict ("snapshot_id", "grid_x", "grid_y") do update
  set
    "count" = aggregated_clicks."count" + excluded."count",
    "last_updated_at" = excluded."last_updated_at";
end;$function$
;

grant delete on table "public"."page_config" to "anon";

grant insert on table "public"."page_config" to "anon";

grant references on table "public"."page_config" to "anon";

grant select on table "public"."page_config" to "anon";

grant trigger on table "public"."page_config" to "anon";

grant truncate on table "public"."page_config" to "anon";

grant update on table "public"."page_config" to "anon";

grant delete on table "public"."page_config" to "authenticated";

grant insert on table "public"."page_config" to "authenticated";

grant references on table "public"."page_config" to "authenticated";

grant select on table "public"."page_config" to "authenticated";

grant trigger on table "public"."page_config" to "authenticated";

grant truncate on table "public"."page_config" to "authenticated";

grant update on table "public"."page_config" to "authenticated";

grant delete on table "public"."page_config" to "service_role";

grant insert on table "public"."page_config" to "service_role";

grant references on table "public"."page_config" to "service_role";

grant select on table "public"."page_config" to "service_role";

grant trigger on table "public"."page_config" to "service_role";

grant truncate on table "public"."page_config" to "service_role";

grant update on table "public"."page_config" to "service_role";

grant delete on table "public"."project_config" to "anon";

grant insert on table "public"."project_config" to "anon";

grant references on table "public"."project_config" to "anon";

grant select on table "public"."project_config" to "anon";

grant trigger on table "public"."project_config" to "anon";

grant truncate on table "public"."project_config" to "anon";

grant update on table "public"."project_config" to "anon";

grant delete on table "public"."project_config" to "authenticated";

grant insert on table "public"."project_config" to "authenticated";

grant references on table "public"."project_config" to "authenticated";

grant select on table "public"."project_config" to "authenticated";

grant trigger on table "public"."project_config" to "authenticated";

grant truncate on table "public"."project_config" to "authenticated";

grant update on table "public"."project_config" to "authenticated";

grant delete on table "public"."project_config" to "service_role";

grant insert on table "public"."project_config" to "service_role";

grant references on table "public"."project_config" to "service_role";

grant select on table "public"."project_config" to "service_role";

grant trigger on table "public"."project_config" to "service_role";

grant truncate on table "public"."project_config" to "service_role";

grant update on table "public"."project_config" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."snapshots" to "anon";

grant insert on table "public"."snapshots" to "anon";

grant references on table "public"."snapshots" to "anon";

grant select on table "public"."snapshots" to "anon";

grant trigger on table "public"."snapshots" to "anon";

grant truncate on table "public"."snapshots" to "anon";

grant update on table "public"."snapshots" to "anon";

grant delete on table "public"."snapshots" to "authenticated";

grant insert on table "public"."snapshots" to "authenticated";

grant references on table "public"."snapshots" to "authenticated";

grant select on table "public"."snapshots" to "authenticated";

grant trigger on table "public"."snapshots" to "authenticated";

grant truncate on table "public"."snapshots" to "authenticated";

grant update on table "public"."snapshots" to "authenticated";

grant delete on table "public"."snapshots" to "service_role";

grant insert on table "public"."snapshots" to "service_role";

grant references on table "public"."snapshots" to "service_role";

grant select on table "public"."snapshots" to "service_role";

grant trigger on table "public"."snapshots" to "service_role";

grant truncate on table "public"."snapshots" to "service_role";

grant update on table "public"."snapshots" to "service_role";

grant delete on table "public"."subscription_limits" to "anon";

grant insert on table "public"."subscription_limits" to "anon";

grant references on table "public"."subscription_limits" to "anon";

grant select on table "public"."subscription_limits" to "anon";

grant trigger on table "public"."subscription_limits" to "anon";

grant truncate on table "public"."subscription_limits" to "anon";

grant update on table "public"."subscription_limits" to "anon";

grant delete on table "public"."subscription_limits" to "authenticated";

grant insert on table "public"."subscription_limits" to "authenticated";

grant references on table "public"."subscription_limits" to "authenticated";

grant select on table "public"."subscription_limits" to "authenticated";

grant trigger on table "public"."subscription_limits" to "authenticated";

grant truncate on table "public"."subscription_limits" to "authenticated";

grant update on table "public"."subscription_limits" to "authenticated";

grant delete on table "public"."subscription_limits" to "service_role";

grant insert on table "public"."subscription_limits" to "service_role";

grant references on table "public"."subscription_limits" to "service_role";

grant select on table "public"."subscription_limits" to "service_role";

grant trigger on table "public"."subscription_limits" to "service_role";

grant truncate on table "public"."subscription_limits" to "service_role";

grant update on table "public"."subscription_limits" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."urls" to "anon";

grant insert on table "public"."urls" to "anon";

grant references on table "public"."urls" to "anon";

grant select on table "public"."urls" to "anon";

grant trigger on table "public"."urls" to "anon";

grant truncate on table "public"."urls" to "anon";

grant update on table "public"."urls" to "anon";

grant delete on table "public"."urls" to "authenticated";

grant insert on table "public"."urls" to "authenticated";

grant references on table "public"."urls" to "authenticated";

grant select on table "public"."urls" to "authenticated";

grant trigger on table "public"."urls" to "authenticated";

grant truncate on table "public"."urls" to "authenticated";

grant update on table "public"."urls" to "authenticated";

grant delete on table "public"."urls" to "service_role";

grant insert on table "public"."urls" to "service_role";

grant references on table "public"."urls" to "service_role";

grant select on table "public"."urls" to "service_role";

grant trigger on table "public"."urls" to "service_role";

grant truncate on table "public"."urls" to "service_role";

grant update on table "public"."urls" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."page_config"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM urls
  WHERE ((urls.id = page_config.url_id) AND (urls.user_id = ( SELECT auth.uid() AS uid))))));


create policy "Enable insert for authenticated users only"
on "public"."page_config"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM urls
  WHERE ((urls.id = page_config.url_id) AND (urls.user_id = ( SELECT auth.uid() AS uid))))));


create policy "Enable read access for all users"
on "public"."page_config"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."page_config"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM urls
  WHERE ((urls.id = page_config.url_id) AND (urls.user_id = ( SELECT auth.uid() AS uid))))));


create policy "Enable delete only if user owns the project"
on "public"."project_config"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = project_config.project_id) AND (projects.user_id = ( SELECT auth.uid() AS uid))))));


create policy "Enable insert only if user owns the project"
on "public"."project_config"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = project_config.project_id) AND (projects.user_id = ( SELECT auth.uid() AS uid))))));


create policy "Enable read access for all users"
on "public"."project_config"
as permissive
for select
to public
using (true);


create policy "Enable update only if user owns the project"
on "public"."project_config"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = project_config.project_id) AND (projects.user_id = ( SELECT auth.uid() AS uid))))));


create policy "Enable users to view and update their own data only"
on "public"."projects"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view and update their own data only"
on "public"."snapshots"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view and manipulate their own data only"
on "public"."urls"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can insert own profile"
on "public"."user_profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile"
on "public"."user_profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view own profile"
on "public"."user_profiles"
as permissive
for select
to public
using ((auth.uid() = id));


CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


