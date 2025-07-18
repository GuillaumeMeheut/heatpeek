revoke delete on table "public"."subscription_limits" from "anon";

revoke insert on table "public"."subscription_limits" from "anon";

revoke references on table "public"."subscription_limits" from "anon";

revoke select on table "public"."subscription_limits" from "anon";

revoke trigger on table "public"."subscription_limits" from "anon";

revoke truncate on table "public"."subscription_limits" from "anon";

revoke update on table "public"."subscription_limits" from "anon";

revoke delete on table "public"."subscription_limits" from "authenticated";

revoke insert on table "public"."subscription_limits" from "authenticated";

revoke references on table "public"."subscription_limits" from "authenticated";

revoke select on table "public"."subscription_limits" from "authenticated";

revoke trigger on table "public"."subscription_limits" from "authenticated";

revoke truncate on table "public"."subscription_limits" from "authenticated";

revoke update on table "public"."subscription_limits" from "authenticated";

revoke delete on table "public"."subscription_limits" from "service_role";

revoke insert on table "public"."subscription_limits" from "service_role";

revoke references on table "public"."subscription_limits" from "service_role";

revoke select on table "public"."subscription_limits" from "service_role";

revoke trigger on table "public"."subscription_limits" from "service_role";

revoke truncate on table "public"."subscription_limits" from "service_role";

revoke update on table "public"."subscription_limits" from "service_role";

revoke delete on table "public"."subscriptions" from "anon";

revoke insert on table "public"."subscriptions" from "anon";

revoke references on table "public"."subscriptions" from "anon";

revoke select on table "public"."subscriptions" from "anon";

revoke trigger on table "public"."subscriptions" from "anon";

revoke truncate on table "public"."subscriptions" from "anon";

revoke update on table "public"."subscriptions" from "anon";

revoke delete on table "public"."subscriptions" from "authenticated";

revoke insert on table "public"."subscriptions" from "authenticated";

revoke references on table "public"."subscriptions" from "authenticated";

revoke select on table "public"."subscriptions" from "authenticated";

revoke trigger on table "public"."subscriptions" from "authenticated";

revoke truncate on table "public"."subscriptions" from "authenticated";

revoke update on table "public"."subscriptions" from "authenticated";

revoke delete on table "public"."subscriptions" from "service_role";

revoke insert on table "public"."subscriptions" from "service_role";

revoke references on table "public"."subscriptions" from "service_role";

revoke select on table "public"."subscriptions" from "service_role";

revoke trigger on table "public"."subscriptions" from "service_role";

revoke truncate on table "public"."subscriptions" from "service_role";

revoke update on table "public"."subscriptions" from "service_role";

alter table "public"."subscription_limits" drop constraint "subscription_limits_subscription_id_fkey";

alter table "public"."subscription_limits" drop constraint "subscription_limits_subscription_id_type_key";

alter table "public"."subscriptions" drop constraint "subscriptions_stripe_subscription_id_key";

alter table "public"."subscriptions" drop constraint "subscriptions_user_id_fkey";

alter table "public"."subscription_limits" drop constraint "subscription_limits_pkey";

alter table "public"."subscriptions" drop constraint "subscriptions_pkey";

drop index if exists "public"."subscription_limits_pkey";

drop index if exists "public"."subscription_limits_subscription_id_type_key";

drop index if exists "public"."subscriptions_pkey";

drop index if exists "public"."subscriptions_stripe_subscription_id_key";

drop table "public"."subscription_limits";

drop table "public"."subscriptions";

alter table "public"."user_profiles" add column "current_plan" text;

alter table "public"."user_profiles" add column "data_retention_days" integer;

alter table "public"."user_profiles" add column "is_locked" boolean default false;

alter table "public"."user_profiles" add column "max_total_tracked_pages" integer;

alter table "public"."user_profiles" add column "max_websites" integer;

alter table "public"."user_profiles" add column "pageviews_limit" integer;

alter table "public"."user_profiles" add column "subscription_current_period_end" timestamp with time zone;

alter table "public"."user_profiles" add column "subscription_status" text;

alter table "public"."user_profiles" add column "subscription_trial_end" timestamp with time zone;


