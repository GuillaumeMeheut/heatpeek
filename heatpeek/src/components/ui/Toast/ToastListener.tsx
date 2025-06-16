"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const toastKeyMap: Record<string, [string, string]> = {
  success: ["success", "success_description"],
  error: ["error", "error_description"],
  status: ["status", "status_description"],
};

export function ToastListener() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasShownForPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPathWithParams = `${pathname}?${searchParams.toString()}`;

    // Prevent re-triggering toast for the same path/query
    if (hasShownForPath.current === currentPathWithParams) return;

    for (const [type, [key, descKey]] of Object.entries(toastKeyMap)) {
      const message = searchParams.get(key);
      const description = searchParams.get(descKey);

      if (message) {
        // Show toast
        switch (type) {
          case "error":
            toast.error(message, { description: description || undefined });
            break;
          case "success":
            toast.success(message, { description: description || undefined });
            break;
          case "status":
            toast(message, { description: description || undefined });
            break;
        }

        hasShownForPath.current = currentPathWithParams;

        // Remove params from URL
        const cleanedParams = new URLSearchParams(searchParams.toString());
        cleanedParams.delete(key);
        cleanedParams.delete(descKey);

        const newUrl = cleanedParams.toString()
          ? `${pathname}?${cleanedParams.toString()}`
          : pathname;

        router.replace(newUrl, { scroll: false });
        break;
      }
    }
  }, [pathname, searchParams, router]);

  return null;
}
