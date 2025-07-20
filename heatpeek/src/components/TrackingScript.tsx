"use client";
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

  if (!id) {
    return null;
  }

  const script = `<script
  defer
  id="${id}"
  src="${process.env.PUBLIC_TRACKING_URL}hp.js"
></script>`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
          <code>{script}</code>
        </pre>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 flex items-center gap-2"
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
    </div>
  );
}
