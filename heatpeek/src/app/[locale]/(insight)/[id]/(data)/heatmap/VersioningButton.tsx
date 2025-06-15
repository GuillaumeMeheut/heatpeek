"use client";

import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useTransition } from "react";
import { createNewVersion } from "./actions";

export default function VersioningButton({
  urlId,
  device,
}: {
  urlId: string;
  device: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleCreateNewVersion = () => {
    startTransition(async () => {
      try {
        await createNewVersion(urlId, device, window.location.href);
      } catch (error) {
        console.error("Failed to create new version:", error);
      }
    });
  };

  return (
    <Button
      className="mb-4"
      disabled={isPending}
      onClick={handleCreateNewVersion}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
      Create a new version
    </Button>
  );
}
