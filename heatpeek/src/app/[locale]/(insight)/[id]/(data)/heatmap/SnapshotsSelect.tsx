"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnapshots } from "@/hooks/useSnapshots";
import { Loader2 } from "lucide-react";
import { useI18n } from "@locales/client";

export default function SnapshotsSelect({
  defaultSnapshot,
  projectId,
  url,
  device,
}: {
  defaultSnapshot: { id: string; label: string };
  projectId: string;
  url: string;
  device: string;
}) {
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>(
    defaultSnapshot.id
  );
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useI18n();

  const { snapshots, isLoading } = useSnapshots({
    projectId,
    url,
    device,
    enabled: isOpen,
  });

  const [localSnapshots, setLocalSnapshots] = useState<
    { id: string; label: string }[] | null
  >(null);

  const handleSnapshotChange = (value: string) => {
    setSelectedSnapshot(value);

    // Update URL with new snapshot ID
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("snapshotId", value);

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Update selected snapshot when prop changes
  useEffect(() => {
    setSelectedSnapshot(defaultSnapshot.id);
  }, [defaultSnapshot]);

  // Reset local cache when params change
  useEffect(() => {
    setLocalSnapshots(null);
  }, [projectId, url, device]);

  // Initialize local cache on open, keeping local edits if already set
  useEffect(() => {
    if (isOpen && localSnapshots === null && snapshots.length > 0) {
      setLocalSnapshots(snapshots);
    }
  }, [isOpen, snapshots, localSnapshots]);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedSnapshot}
        onValueChange={handleSnapshotChange}
        onOpenChange={handleOpenChange}
        open={isOpen}
      >
        <SelectTrigger className="w-[220px]" disabled={isLoading}>
          <SelectValue placeholder={t("snapshots.selectPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </SelectItem>
          ) : (
            <>
              {(localSnapshots ?? snapshots).length === 0 && (
                <SelectItem key={defaultSnapshot.id} value={defaultSnapshot.id}>
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">
                      {defaultSnapshot.label ?? t("snapshots.noLabel")}
                    </span>
                  </div>
                </SelectItem>
              )}
              {(localSnapshots ?? snapshots).map((snapshot) => (
                <SelectItem key={snapshot.id} value={snapshot.id}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="truncate">
                      {snapshot.label ?? t("snapshots.noLabel")}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
