"use client";

import { useTransition } from "react";
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
import { Trash2, Loader2 } from "lucide-react";
import { deleteSnapshot } from "./actions";
import { useSnapshots } from "@/hooks/useSnapshots";
import { toast } from "sonner";
import { useI18n } from "@locales/client";

type Props = {
  projectId: string;
  url: string;
  device: string;
  currentSnapshotId: string;
};

export default function DeleteSnapshotButton({
  projectId,
  url,
  device,
  currentSnapshotId,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useI18n();
  // Fetch list only when we need to compute next candidate (not rendered)
  const { snapshots } = useSnapshots({ projectId, url, device, enabled: true });

  const isDeletingDisabled =
    snapshots.length === 0 || snapshots[0]?.id === currentSnapshotId;

  const onConfirmDelete = () => {
    startTransition(async () => {
      try {
        // Compute next snapshot selection if we are deleting the current one
        let nextId: string | null = null;
        if (currentSnapshotId) {
          const remaining = snapshots.filter((s) => s.id !== currentSnapshotId);
          nextId = remaining[0]?.id ?? null;
        }

        await deleteSnapshot(currentSnapshotId);
        toast.success(t("snapshots.toastDeleted"));

        // Update URL to either next snapshot or remove param
        const newParams = new URLSearchParams(searchParams);
        if (nextId) {
          newParams.set("snapshotId", nextId);
        } else {
          newParams.delete("snapshotId");
        }
        router.replace(`?${newParams.toString()}`, { scroll: false });
        router.refresh();
      } catch (e) {
        const message =
          e instanceof Error ? e.message : t("snapshots.toastDeleteFailed");
        toast.error(message);
      }
    });
  };

  return (
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
  );
}
