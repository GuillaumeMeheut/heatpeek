"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type SnapshotOption = { id: string; label: string };

type UseSnapshotsParams = {
  projectId: string;
  url: string;
  device: string;
  enabled?: boolean; // when true, will trigger the fetch
};

type UseSnapshotsResult = {
  snapshots: SnapshotOption[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setSnapshots: (snapshots: SnapshotOption[]) => void;
};

export function useSnapshots({
  projectId,
  url,
  device,
  enabled = false,
}: UseSnapshotsParams): UseSnapshotsResult {
  const supabase = useMemo(() => createClient(), []);
  const [snapshots, setSnapshots] = useState<SnapshotOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track the last parameter set we fetched for, to avoid duplicate fetches on the same open
  const lastKeyRef = useRef<string>("");

  const buildKey = (p: string, u: string, d: string) => `${p}::${u}::${d}`;

  const fetchSnapshots = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("snapshots")
        .select(
          `id, 
       label,
       created_at,
       urls!inner ()`
        )
        .eq("urls.project_id", projectId)
        .eq("urls.path", url)
        .eq("device", device)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setSnapshots(data ?? []);
      lastKeyRef.current = buildKey(projectId, url, device);
    } catch (e) {
      setError(e as Error);
      setSnapshots([]);
    } finally {
      setIsLoading(false);
    }
  }, [device, projectId, supabase, url]);

  // Reset options when parameters change
  useEffect(() => {
    setSnapshots([]);
    // do not reset lastKeyRef here; it will be recomputed on next enabled=true
  }, [projectId, url, device]);

  // On-demand trigger based on `enabled`
  useEffect(() => {
    if (!enabled) return;
    const currentKey = buildKey(projectId, url, device);
    if (lastKeyRef.current !== currentKey) {
      void fetchSnapshots();
    }
  }, [enabled, device, projectId, url, fetchSnapshots]);

  return {
    snapshots,
    isLoading,
    error,
    refetch: fetchSnapshots,
    setSnapshots,
  };
}
