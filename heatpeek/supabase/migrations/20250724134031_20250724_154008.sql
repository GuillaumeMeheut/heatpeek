alter table "public"."project_config" drop column "usageExceeded";

alter table "public"."project_config" add column "usage_exceeded" boolean not null default false;


