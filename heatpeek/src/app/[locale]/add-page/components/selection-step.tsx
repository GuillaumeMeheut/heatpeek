"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Lock } from "lucide-react";
import { TrackingScript } from "@/components/TrackingScript";
import { useI18n } from "@locales/client";

type SelectionStepProps = {
  onSelectSimple: () => void;
  onSelectAuth: () => void;
  trackingId: string | null;
};

export function SelectionStep({
  onSelectSimple,
  onSelectAuth,
  trackingId,
}: SelectionStepProps) {
  const t = useI18n();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("addPage.selection.title")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("addPage.selection.description")}
          </p>
          <TrackingScript id={trackingId} />
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          {t("addPage.selection.chooseType")}
        </h2>
        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Simple Page Card */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("addPage.selection.simple.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">
                {t("addPage.selection.simple.description")}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={onSelectSimple}>
                {t("addPage.selection.simple.title")}
              </Button>
            </CardFooter>
          </Card>

          {/* Auth Page Card */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("addPage.selection.auth.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">
                {t("addPage.selection.auth.description")}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={onSelectAuth}>
                {t("addPage.selection.auth.title")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
