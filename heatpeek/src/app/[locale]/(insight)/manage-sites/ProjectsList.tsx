"use client";

import { Project } from "@/lib/supabase/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Globe,
  BarChart3,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { WebsiteType } from "../[id]/get-started/types";
import { deleteProjectAction, updateProjectAction } from "./actions";
import { toast } from "sonner";
import { useI18n } from "@locales/client";
import Link from "next/link";
import { projectUpdateSchema } from "./types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const t = useI18n();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    startTransition(async () => {
      try {
        await deleteProjectAction(project.id);
        toast.success(t("projects.deleteProject.success"));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : t("projects.deleteProject.error")
        );
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="hover:shadow-lg transition-shadow flex flex-col justify-between"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{project.label}</CardTitle>
                {project.type && (
                  <Badge variant="secondary" className="mt-2">
                    {project.type}
                  </Badge>
                )}
              </div>
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t("projects.actions.edit")}
                    </DropdownMenuItem>

                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t("projects.actions.delete")}
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent
                  onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    document.body.style.pointerEvents = "";
                  }}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("projects.deleteProject.confirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("projects.deleteProject.confirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("global.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => handleDeleteProject(project)}
                      disabled={isPending}
                    >
                      {t("global.delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-auto">
            <div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {project.base_url}
              </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LinkIcon className="w-3 h-3" />
                  {t("projects.stats.urls")}
                </div>
                <div className="font-medium">{project.urlCount}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <BarChart3 className="w-3 h-3" />
                  {t("projects.stats.views")}
                </div>
                <div className="font-medium">
                  {/* {project.totalViews.toLocaleString()} */}
            {/* {project.totalViews} */}
            {/* </div> */}
            {/* </div> */}
            {/* </div> */}

            <div className="flex gap-2">
              <Link href={`/${project.id}/get-started`}>
                <Button size="sm" className="flex-1">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  {t("projects.buttons.viewAnalytics")}
                </Button>
              </Link>
              <Link href={`/${project.id}/manage-urls`}>
                <Button variant="outline" size="sm" className="flex-1">
                  <LinkIcon className="w-4 h-4 mr-1" />
                  {t("projects.buttons.manageUrls")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
      {editingProject && (
        <EditDialog
          editingProject={editingProject}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />
      )}
    </div>
  );
}

const EditDialog = ({
  editingProject,
  isEditDialogOpen,
  setIsEditDialogOpen,
}: {
  editingProject: Project;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}) => {
  const t = useI18n();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<WebsiteType | null>(
    editingProject.type as WebsiteType | null
  );

  useEffect(() => {
    setType(editingProject.type as WebsiteType | null);
  }, [editingProject.type]);

  const handleSave = (formData: FormData) => {
    startTransition(async () => {
      try {
        const type = formData.get("type") === "" ? null : formData.get("type");
        const label =
          formData.get("label") === "" ? null : formData.get("label");
        const rawData = {
          label,
          type,
          baseUrl: formData.get("baseUrl"),
        };
        const result = projectUpdateSchema(t).safeParse(rawData);
        if (!result.success) {
          throw new Error(result.error.errors[0].message);
        }

        // Check if there are any changes
        const hasChanges =
          result.data.label !== editingProject.label ||
          result.data.type !== editingProject.type ||
          result.data.baseUrl !== editingProject.base_url;

        if (!hasChanges) {
          setIsEditDialogOpen(false);
          return;
        }

        await updateProjectAction(editingProject.id, result.data);
        setIsEditDialogOpen(false);
        toast.success(t("projects.editDialog.success"));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : t("projects.editDialog.error")
        );
      }
    });
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent
        className="sm:max-w-[500px]"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.body.style.pointerEvents = "";
        }}
      >
        <Form action={handleSave} isDisabled={isPending}>
          <DialogHeader>
            <DialogTitle>{t("projects.editDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("projects.editDialog.description")}
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="label">
                  {t("projects.editDialog.labels.projectName")}
                </Label>
                <Input
                  id="label"
                  name="label"
                  defaultValue={editingProject.label || undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="baseUrl">
                  {t("projects.editDialog.labels.baseUrl")}
                </Label>
                <Input
                  id="baseUrl"
                  name="baseUrl"
                  defaultValue={editingProject.base_url}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">
                  {t("projects.editDialog.labels.category")}
                </Label>
                <Select
                  value={type || undefined}
                  onValueChange={(value) => setType(value as WebsiteType)}
                  name="type"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(WebsiteType).map((category: string) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="type" value={type || undefined} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {t("projects.editDialog.buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("projects.editDialog.buttons.saveChanges")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
