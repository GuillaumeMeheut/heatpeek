import type { Env } from "../env";
import { ProjectConfigResult } from "../services/supabase";

export const configKey = (trackingId: string, path?: string) =>
  `config:t-${trackingId}${path ? `-p-${path}` : ""}`;

export const snapshotKey = (trackingId: string, path: string, device: string) =>
  `snapshot:t-${trackingId}-p-${path}-d-${device}`;

const EXPIRATION_KV_SNAPSHOT_TTL = 21600; // 6hours
const EXPIRATION_KV_CONFIG_TTL = 21600; // 6hours

export const getConfigCache = async (
  trackingId: string,
  path: string,
  CACHE_HEATPEEK: Env["CACHE_HEATPEEK"]
): Promise<ProjectConfigResult | "__NOT_FOUND__" | null> => {
  const KVKey = configKey(trackingId, path);
  const cached = await CACHE_HEATPEEK.get(KVKey, { type: "json" });
  return cached as ProjectConfigResult | "__NOT_FOUND__" | null;
};

export const setConfigCache = async (
  trackingId: string,
  path: string,
  config: ProjectConfigResult | null,
  CACHE_HEATPEEK: Env["CACHE_HEATPEEK"],
  isDevelopment: boolean = false
): Promise<void> => {
  const KVKey = configKey(trackingId, path);
  const value = config === null ? '"__NOT_FOUND__"' : config;
  const expirationTtl = isDevelopment ? 60 : EXPIRATION_KV_CONFIG_TTL;
  await CACHE_HEATPEEK.put(KVKey, JSON.stringify(value), {
    expirationTtl,
  });
};

export const getSnapshotCache = async (
  trackingId: string,
  path: string,
  device: string,
  CACHE_HEATPEEK: Env["CACHE_HEATPEEK"]
): Promise<string | null> => {
  const KVKey = snapshotKey(trackingId, path, device);
  const cached = await CACHE_HEATPEEK.get(KVKey, { type: "text" });
  return cached as string | null;
};

export const setSnapshotCache = async (
  trackingId: string,
  path: string,
  device: string,
  snapshotId: string,
  CACHE_HEATPEEK: Env["CACHE_HEATPEEK"],
  isDevelopment: boolean = false
): Promise<void> => {
  const KVKey = snapshotKey(trackingId, path, device);
  const expirationTtl = isDevelopment ? 60 : EXPIRATION_KV_SNAPSHOT_TTL;
  await CACHE_HEATPEEK.put(KVKey, snapshotId, {
    expirationTtl,
  });
};
