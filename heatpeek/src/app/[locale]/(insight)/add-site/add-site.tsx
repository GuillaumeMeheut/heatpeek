"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@locales/client";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebsiteType } from "./types";
import { addSiteAction } from "./actions";

export function AddSite() {
  const t = useI18n();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addSiteAction(formData);
      if (result?.error) {
        toast({
          title: t("setupSite.error.title"),
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("setupSite.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteLabel">{t("setupSite.siteLabel")}</Label>
              <Input
                id="siteLabel"
                name="siteLabel"
                placeholder={t("setupSite.siteLabelPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              *<Label htmlFor="baseUrl">{t("setupSite.baseUrl")}</Label>
              <Input
                id="baseUrl"
                name="baseUrl"
                type="url"
                placeholder={t("setupSite.baseUrlPlaceholder")}
                required
              />
              <p className="text-xs text-muted-foreground">
                *{t("setupSite.baseUrlDescription")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteType">{t("setupSite.websiteType")}</Label>
              <Select name="websiteType">
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("setupSite.websiteTypePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WebsiteType.SAAS}>SaaS</SelectItem>
                  <SelectItem value={WebsiteType.ECOMMERCE}>
                    E-commerce
                  </SelectItem>
                  <SelectItem value={WebsiteType.BLOG}>Blog</SelectItem>
                  <SelectItem value={WebsiteType.PORTFOLIO}>
                    Portfolio
                  </SelectItem>
                  <SelectItem value={WebsiteType.CORPORATE}>
                    Corporate
                  </SelectItem>
                  <SelectItem value={WebsiteType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                t("setupSite.validate")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
