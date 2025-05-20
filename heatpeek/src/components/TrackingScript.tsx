"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../../locales/client";

interface TrackingScriptProps {
  id: string | null;
}

export function TrackingScript({ id }: TrackingScriptProps) {
  const [copied, setCopied] = useState(false);
  const t = useI18n();

  const script = `<script
  defer
  id="${id}"
  src="${process.env.NEXT_PUBLIC_SITE_URL}heatpeek.js"
></script>`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("tracking.title")}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                {t("tracking.copied")}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {t("tracking.copy")}
              </>
            )}
          </Button>
        </div>
        <div className="relative">
          <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
            <code>{script}</code>
          </pre>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("tracking.instructions")}
        </p>
      </div>
    </Card>
  );
}
