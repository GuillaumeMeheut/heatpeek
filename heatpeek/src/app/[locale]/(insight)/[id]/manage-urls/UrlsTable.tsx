"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { UrlAndConfig } from "@/lib/supabase/queries";
import { useI18n } from "@locales/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { updateUrlAction, deleteUrlAction } from "./actions";
import { toast } from "sonner";
import { urlUpdateSchema } from "./types";
import { Form } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function UrlsTable({
  urls,
  projectId,
}: {
  urls: UrlAndConfig[];
  projectId: string;
}) {
  const t = useI18n();
  const [editingUrl, setEditingUrl] = useState<UrlAndConfig | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleEditUrl = (url: UrlAndConfig) => {
    setEditingUrl(url);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUrl = async (url: UrlAndConfig) => {
    startTransition(async () => {
      try {
        await deleteUrlAction(url.id, url.tracking_id, url.path);
        toast.success(t("urlsTable.deleteUrl.success"));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : t("urlsTable.deleteUrl.error")
        );
      }
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {t("urlsTable.title")} ({urls.length})
              </CardTitle>
              <CardDescription>{t("urlsTable.description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">
                    {t("urlsTable.columns.urlAndName")}
                  </th>
                  <th className="text-right p-4 font-medium">
                    {t("urlsTable.columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr
                    key={url.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-medium">{url.label}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          {url.path}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/${projectId}/dashboard?url=${url.path}`}>
                          <Button variant="ghost" size="sm">
                            {t("urlsTable.buttons.view")}
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUrl(url)}
                        >
                          {t("urlsTable.buttons.edit")}
                          <Edit className="w-4 h-4 ml-2" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              {t("urlsTable.buttons.delete")}
                              <Trash2 className="w-4 h-4 ml-2" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("urlsTable.deleteUrl.confirmTitle")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("urlsTable.deleteUrl.confirmDescription")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("global.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDeleteUrl(url)}
                                disabled={isPending}
                              >
                                {isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  t("global.delete")
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <EditDialog
        editingUrl={editingUrl}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
      />
    </div>
  );
}

const EditDialog = ({
  editingUrl,
  isEditDialogOpen,
  setIsEditDialogOpen,
}: {
  editingUrl: UrlAndConfig | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}) => {
  const t = useI18n();
  const [isPending, startTransition] = useTransition();

  if (!editingUrl) return null;

  const handleEditUrl = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const rawData = {
          label: formData.get("label"),
          sensitiveElement: formData.get("sensitiveElement"),
          excludeElements: formData.get("excludeElements"),
        };

        const result = urlUpdateSchema(t).safeParse(rawData);
        if (!result.success) {
          throw new Error(result.error.errors[0].message);
        }

        const hasChanges =
          result.data.label !== editingUrl.label ||
          JSON.stringify(result.data.sensitiveElement) !==
            JSON.stringify(editingUrl.page_config.privacy_el) ||
          JSON.stringify(result.data.excludeElements) !==
            JSON.stringify(editingUrl.page_config.exclude_el);

        if (!hasChanges) {
          setIsEditDialogOpen(false);
          return;
        }

        await updateUrlAction(editingUrl.id, formData);
        setIsEditDialogOpen(false);
        toast.success(t("urlsTable.editDialog.success"));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : t("urlsTable.editDialog.error")
        );
      }
    });
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <Form action={handleEditUrl} isDisabled={isPending}>
          <DialogHeader>
            <DialogTitle>{t("urlsTable.editDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("urlsTable.editDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="label">
                {t("urlsTable.editDialog.nameLabel")}
              </Label>
              <Input
                id="label"
                defaultValue={editingUrl.label ?? ""}
                name="label"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sensitiveElement">Sensitive elements</Label>
              <Input
                id="sensitiveElement"
                name="sensitiveElement"
                defaultValue={
                  editingUrl.page_config.privacy_el?.join(", ") ?? ""
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="excludeElements">
                {t("addUrl.excludeElementsLabel")}
              </Label>
              <Input
                id="excludeElements"
                name="excludeElements"
                defaultValue={
                  editingUrl.page_config.exclude_el?.join(", ") ?? ""
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isPending}
            >
              {t("urlsTable.editDialog.cancelButton")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("urlsTable.editDialog.saveButton")
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
