import type { Env } from "../env";
import { ProjectConfigResult } from "../services/supabase";

export const snapshotKey = (trackingId: string, path: string, device: string) =>
  `snapshot:t-${trackingId}-p-${path}-d-${device}`;

export const configKey = (trackingId: string, path: string) =>
  `config:t-${trackingId}-p-${path}`;

const EXPIRATION_KV_SNAPSHOT_TTL = 300; //5min
const EXPIRATION_KV_CONFIG_TTL = 300; //5min

export const getConfigCache = async (
  trackingId: string,
  path: string,
  CACHE_HEATPEEK: Env["CACHE_HEATPEEK"]
): Promise<ProjectConfigResult | null> => {
  const KVKey = configKey(trackingId, path);
  const cached = await CACHE_HEATPEEK.get(KVKey, { type: "json" });
  return cached as ProjectConfigResult | null;
};

export const setConfigCache = async (
  trackingId: string,
  path: string,
  config: ProjectConfigResult | null,
  CACHE_HEATPEEK: Env["CACHE_HEATPEEK"]
): Promise<void> => {
  const KVKey = configKey(trackingId, path);
  await CACHE_HEATPEEK.put(KVKey, JSON.stringify(config), {
    expirationTtl: EXPIRATION_KV_CONFIG_TTL,
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
  CACHE_HEATPEEK: Env["CACHE_HEATPEEK"]
): Promise<void> => {
  const KVKey = snapshotKey(trackingId, path, device);
  await CACHE_HEATPEEK.put(KVKey, snapshotId, {
    expirationTtl: EXPIRATION_KV_SNAPSHOT_TTL,
  });
};
