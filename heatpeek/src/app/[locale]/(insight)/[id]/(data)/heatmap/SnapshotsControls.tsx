"use client";

import { useTransition, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteSnapshot } from "./actions";
import { useSnapshots } from "@/hooks/useSnapshots";
import { toast } from "sonner";
import { useI18n } from "@locales/client";
import VersioningButton from "./VersioningButton";
import { DeviceEnum } from "./types";

type Props = {
  defaultSnapshot: { id: string; label: string };
  projectId: string;
  url: string;
  device: DeviceEnum;
  urlId: string;
};

export default function SnapshotsControls({
  defaultSnapshot,
  projectId,
  url,
  device,
  urlId,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedSnapshot, setSelectedSnapshot] = useState<string>(
    defaultSnapshot.id
  );
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useI18n();

  const { snapshots, isLoading, setSnapshots } = useSnapshots({
    projectId,
    url,
    device,
    enabled: isOpen,
  });

  // Memoize the display snapshots to avoid unnecessary re-renders
  const displaySnapshots = useMemo(() => {
    return snapshots.length > 0 ? snapshots : [defaultSnapshot];
  }, [snapshots, defaultSnapshot]);

  // Memoize the delete disabled state
  const isDeletingDisabled = useMemo(() => {
    return snapshots.length === 0 || snapshots[0]?.id === selectedSnapshot;
  }, [snapshots, selectedSnapshot]);

  // Memoize the next snapshot ID for deletion
  const nextSnapshotId = useMemo(() => {
    if (!selectedSnapshot) return null;
    const remaining = snapshots.filter((s) => s.id !== selectedSnapshot);
    return remaining[0]?.id ?? null;
  }, [snapshots, selectedSnapshot]);

  const handleSnapshotChange = useCallback(
    (value: string) => {
      setSelectedSnapshot(value);

      // Update URL with new snapshot ID
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("snapshotId", value);
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const updateUrlAfterDeletion = useCallback(
    (nextId: string | null) => {
      const newParams = new URLSearchParams(searchParams);
      if (nextId) {
        newParams.set("snapshotId", nextId);
        setSelectedSnapshot(nextId);
      } else {
        newParams.delete("snapshotId");
      }
      router.replace(`?${newParams.toString()}`, { scroll: false });
      router.refresh();
    },
    [searchParams, router]
  );

  const onConfirmDelete = useCallback(() => {
    startTransition(async () => {
      try {
        await deleteSnapshot(selectedSnapshot);
        toast.success(t("snapshots.toastDeleted"));

        // Remove deleted snapshot from snapshots array
        const updatedSnapshots = snapshots.filter(
          (s) => s.id !== selectedSnapshot
        );
        setSnapshots(updatedSnapshots);

        // Update URL to either next snapshot or remove param
        updateUrlAfterDeletion(nextSnapshotId);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : t("snapshots.toastDeleteFailed");
        toast.error(message);
      }
    });
  }, [
    selectedSnapshot,
    snapshots,
    setSnapshots,
    nextSnapshotId,
    updateUrlAfterDeletion,
    t,
  ]);

  // Update selected snapshot when prop changes
  useEffect(() => {
    setSelectedSnapshot(defaultSnapshot.id);
  }, [defaultSnapshot.id]);

  return (
    <div className="flex items-center gap-2 mb-4">
      <VersioningButton urlId={urlId} device={device} />
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
            displaySnapshots.map((snapshot) => (
              <SelectItem key={snapshot.id} value={snapshot.id}>
                <div className="flex items-center justify-between w-full gap-2">
                  <span className="truncate">
                    {snapshot.label ?? t("snapshots.noLabel")}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isDeletingDisabled || isPending}
            className="ml-auto"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {t("snapshots.deleteButton")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("snapshots.deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("snapshots.deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("global.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} disabled={isPending}>
              {t("global.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
