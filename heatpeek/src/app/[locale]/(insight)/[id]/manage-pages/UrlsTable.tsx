"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MousePointerClick, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { updateUrlAction, deleteUrlAction } from "./actions";
import { toast } from "sonner";
import { urlUpdateSchema } from "./types";

export default function UrlsTable({ urls }: { urls: UrlAndConfig[] }) {
  const t = useI18n();
  const [editingUrl, setEditingUrl] = useState<UrlAndConfig | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingUrlId, setDeletingUrlId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "green" : "destructive"}>
        {isActive
          ? t("urlsTable.status.active")
          : t("urlsTable.status.inactive")}
      </Badge>
    );
  };

  const handleEditUrl = (url: UrlAndConfig) => {
    setEditingUrl(url);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUrl = async (url: UrlAndConfig) => {
    setDeletingUrlId(url.id);
    startTransition(async () => {
      try {
        await deleteUrlAction(url.id);
        toast.success(t("urlsTable.deleteUrl.success"));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : t("urlsTable.deleteUrl.error")
        );
      } finally {
        setDeletingUrlId(null);
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
                  <th className="text-left p-4 font-medium">
                    {t("urlsTable.columns.status")}
                  </th>
                  <th className="text-left p-4 font-medium">
                    {t("urlsTable.columns.performance")}
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
                      {getStatusBadge(url.page_config.is_active)}
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {url.views.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            {t("urlsTable.performance.views")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{url.clicks}</span>{" "}
                          <span className="text-muted-foreground">
                            {t("urlsTable.performance.clicks")}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          {t("urlsTable.buttons.view")}
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUrl(url)}
                        >
                          {t("urlsTable.buttons.edit")}
                          <Edit className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUrl(url)}
                        >
                          {deletingUrlId === url.id && isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              {t("urlsTable.buttons.delete")}
                              <Trash2 className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
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
          is_active: formData.get("is_active") === "on",
        };

        const result = urlUpdateSchema(t).safeParse(rawData);
        if (!result.success) {
          throw new Error(result.error.errors[0].message);
        }
        await updateUrlAction(editingUrl.id, result.data);
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
        <form action={handleEditUrl}>
          <DialogHeader>
            <DialogTitle>{t("urlsTable.editDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("urlsTable.editDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="label">
                {t("urlsTable.editDialog.nameLabel")} *
              </Label>
              <Input
                id="label"
                defaultValue={editingUrl.label ?? ""}
                name="label"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                name="is_active"
                defaultChecked={editingUrl.page_config.is_active}
              />
              <Label htmlFor="is_active">
                {t("urlsTable.editDialog.trackingLabel")}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
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
        </form>
      </DialogContent>
    </Dialog>
  );
};
