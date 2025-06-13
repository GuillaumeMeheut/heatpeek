"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast/toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toast, toasts } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check root level parameters
    const status = searchParams.get("status");
    const status_description = searchParams.get("status_description");
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");
    const success = searchParams.get("success");
    const success_description = searchParams.get("success_description");

    // Check url parameter for nested status
    const urlParam = searchParams.get("url");
    let nestedStatus = null;
    let nestedStatusDescription = null;
    let nestedError = null;
    let nestedErrorDescription = null;
    let nestedSuccess = null;
    let nestedSuccessDescription = null;

    if (urlParam) {
      try {
        const urlSearchParams = new URLSearchParams(
          urlParam.split("?")[1] || ""
        );
        nestedStatus = urlSearchParams.get("status");
        nestedStatusDescription = urlSearchParams.get("status_description");
        nestedError = urlSearchParams.get("error");
        nestedErrorDescription = urlSearchParams.get("error_description");
        nestedSuccess = urlSearchParams.get("success");
        nestedSuccessDescription = urlSearchParams.get("success_description");
      } catch {
        // Ignore parsing errors
      }
    }

    // Use either root level or nested parameters
    const finalStatus = status || nestedStatus;
    const finalStatusDescription =
      status_description || nestedStatusDescription;
    const finalError = error || nestedError;
    const finalErrorDescription = error_description || nestedErrorDescription;
    const finalSuccess = success || nestedSuccess;
    const finalSuccessDescription =
      success_description || nestedSuccessDescription;

    if (finalError || finalStatus || finalSuccess) {
      toast({
        title: finalError
          ? finalError ?? "Hmm... Something went wrong."
          : finalSuccess
          ? finalSuccess ?? "Success!"
          : finalStatus ?? "Alright!",
        description: finalError
          ? finalErrorDescription
          : finalSuccess
          ? finalSuccessDescription
          : finalStatusDescription,
        variant: finalError
          ? "destructive"
          : finalSuccess
          ? "success"
          : undefined,
      });

      // Clear any 'error', 'status', 'status_description', 'error_description', 'success', and 'success_description' search params
      const newSearchParams = new URLSearchParams(searchParams.toString());
      const paramsToRemove = [
        "error",
        "status",
        "status_description",
        "error_description",
        "success",
        "success_description",
      ];
      paramsToRemove.forEach((param) => newSearchParams.delete(param));

      // If we had nested parameters, we need to clean up the url parameter
      if (urlParam && (nestedStatus || nestedError || nestedSuccess)) {
        try {
          const urlSearchParams = new URLSearchParams(
            urlParam.split("?")[1] || ""
          );
          paramsToRemove.forEach((param) => urlSearchParams.delete(param));
          const cleanUrl =
            urlParam.split("?")[0] +
            (urlSearchParams.toString()
              ? `?${urlSearchParams.toString()}`
              : "");
          newSearchParams.set("url", cleanUrl);
        } catch {
          // Ignore parsing errors
        }
      }

      const redirectPath = `${pathname}?${newSearchParams.toString()}`;
      router.replace(redirectPath, { scroll: false });
    }
  }, [searchParams]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
