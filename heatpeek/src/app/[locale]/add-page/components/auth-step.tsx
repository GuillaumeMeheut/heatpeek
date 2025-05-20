"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Image } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@locales/client";

type AuthStepProps = {
  onBack: () => void;
};

export function AuthStep({ onBack }: AuthStepProps) {
  const t = useI18n();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("addPage.auth.back")}
          </Button>
        </div>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t("addPage.auth.title")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {t("addPage.auth.instructions")}
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  {t("addPage.auth.screenshot.title")}
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>{t("addPage.auth.screenshot.steps.install")}</li>
                  <li>{t("addPage.auth.screenshot.steps.login")}</li>
                  <li>{t("addPage.auth.screenshot.steps.click")}</li>
                  <li>{t("addPage.auth.screenshot.steps.wait")}</li>
                </ol>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="https://chrome.google.com/webstore/detail/heatpeek/your-extension-id">
                {t("addPage.auth.screenshot.installButton")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
