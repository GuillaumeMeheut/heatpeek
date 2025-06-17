"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { useI18n } from "@locales/client";
import { addNewUrlAndPageConfigAction } from "./actions";
import { toast } from "sonner";
import { urlAddSchema } from "./types";
import { Form } from "@/components/ui/form";

export default function AddUrlDialog({ projectId }: { projectId: string }) {
  const t = useI18n();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddUrl = async (formData: FormData) => {
    startTransition(async () => {
      try {
        formData.append("projectId", projectId);

        const rawData = {
          url: formData.get("url"),
          label: formData.get("label"),
          is_active: formData.get("is_active") === "on",
          projectId: formData.get("projectId"),
        };
        const result = urlAddSchema(t).safeParse(rawData);

        if (!result.success) {
          throw new Error(result.error.errors[0].message);
        }

        await addNewUrlAndPageConfigAction(result.data);
        setIsAddDialogOpen(false);
        toast.success(t("addUrl.success"));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t("addUrl.error"));
      }
    });
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          {t("addUrl.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Form action={handleAddUrl} isDisabled={isPending}>
          <DialogHeader>
            <DialogTitle>{t("addUrl.title")}</DialogTitle>
            <DialogDescription>{t("addUrl.description")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">{t("addUrl.urlLabel")}</Label>
              <Input
                id="url"
                name="url"
                placeholder={t("addUrl.urlPlaceholder")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="label">{t("addUrl.labelLabel")}</Label>
              <Input
                id="label"
                name="label"
                placeholder={t("addUrl.labelPlaceholder")}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" name="is_active" defaultChecked={true} />
              <Label htmlFor="is_active">{t("addUrl.trackingLabel")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              {t("addUrl.cancelButton")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("addUrl.addButton")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
