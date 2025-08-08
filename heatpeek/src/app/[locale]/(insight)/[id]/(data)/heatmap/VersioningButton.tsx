"use client";

import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useState, useTransition } from "react";
import { createNewVersion } from "./actions";
import { Device } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { useI18n } from "@locales/client";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function VersioningButton({
  urlId,
  device,
}: {
  urlId: string;
  device: Device;
}) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useI18n();
  const searchParams = useSearchParams();

  const handleCreateNewVersion = (formData: FormData) => {
    startTransition(async () => {
      try {
        const rawLabel = formData.get("label");
        const label = (typeof rawLabel === "string" ? rawLabel : "").trim();
        if (!label) {
          throw new Error("Please provide a label for the new version");
        }
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("snapshotId");
        await createNewVersion(urlId, device, window.location.href, label);
        setIsDialogOpen(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create new version";
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <RefreshCcw className="h-4 w-4" />
          {t("versioning.createNewVersionButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("versioning.confirmTitle")}</DialogTitle>
          <DialogDescription>
            {t("versioning.confirmDescription")}
          </DialogDescription>
        </DialogHeader>
        <Form action={handleCreateNewVersion} isDisabled={isPending}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="label"
                name="label"
                placeholder={t("addPage.simple.snapshotName")}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsDialogOpen(false)}
            >
              {t("global.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("versioning.createNewVersionAction")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
