"use client";

import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useTransition } from "react";
import { createNewVersion } from "./actions";
import { Device } from "@/types/database";
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
import { useI18n } from "@locales/client";

export default function VersioningButton({
  urlId,
  device,
}: {
  urlId: string;
  device: Device;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useI18n();

  const handleCreateNewVersion = () => {
    startTransition(async () => {
      try {
        await createNewVersion(urlId, device, window.location.href);
      } catch (error) {
        console.error("Failed to create new version:", error);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mb-4">
          <RefreshCcw className="h-4 w-4" />
          {t("versioning.createNewVersionButton")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("versioning.confirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("versioning.confirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("global.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            variant="default"
            onClick={handleCreateNewVersion}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("versioning.createNewVersionAction")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
