"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { projectAddSchema, WebsiteType } from "./types";
import { toast } from "sonner";
import { addProjectAction } from "./actions";
import { useI18n } from "@locales/client";
import { Form } from "@/components/ui/form";

export default function AddProject() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [type, setType] = useState<WebsiteType | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useI18n();

  const handleAddProject = (formData: FormData) => {
    startTransition(async () => {
      try {
        const type = formData.get("type") === "" ? null : formData.get("type");
        const rawData = {
          label: formData.get("label"),
          type,
          baseUrl: formData.get("baseUrl"),
        };
        const result = projectAddSchema(t).safeParse(rawData);

        if (!result.success) {
          throw new Error(result.error.errors[0].message);
        }

        await addProjectAction(result.data);
        setIsAddDialogOpen(false);
        toast.success(t("projects.addProject.success"));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : t("projects.addProject.error")
        );
      }
    });
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          {t("projects.addProject.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("projects.addProject.title")}</DialogTitle>
          <DialogDescription>
            {t("projects.addProject.description")}
          </DialogDescription>
        </DialogHeader>
        <Form action={handleAddProject} isDisabled={isPending}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="label">
                {t("projects.addProject.labels.projectName")}
              </Label>
              <Input
                id="label"
                name="label"
                placeholder={t(
                  "projects.addProject.labels.projectNamePlaceholder"
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baseUrl">
                {t("projects.addProject.labels.baseUrl")}
              </Label>
              <Input
                id="baseUrl"
                name="baseUrl"
                placeholder={t("projects.addProject.labels.baseUrlPlaceholder")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">
                {t("projects.addProject.labels.category")}
              </Label>
              <Select
                value={type || undefined}
                onValueChange={(value) => setType(value as WebsiteType)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "projects.addProject.labels.categoryPlaceholder"
                    )}
                  />
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
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsAddDialogOpen(false)}
            >
              {t("projects.addProject.buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("projects.addProject.buttons.create")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
