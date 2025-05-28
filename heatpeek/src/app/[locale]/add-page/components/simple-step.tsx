"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, FileText, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useMemo } from "react";
import { useI18n } from "@locales/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type SimpleStepProps = {
  onBack: () => void;
  trackingId: string | null;
};

export function SimpleStep({ onBack, trackingId }: SimpleStepProps) {
  const t = useI18n();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = useMemo(
    () =>
      z
        .object({
          pageUrl: z.string().url(t("addPage.simple.validation.invalidUrl")),
          snapshotName: z
            .string()
            .min(1, t("addPage.simple.validation.snapshotNameRequired")),
          popupBlocking: z.enum([
            "omit-popups",
            "dont-block",
            "specific-elements",
          ]),
          cssSelectors: z.string().optional(),
        })
        .refine(
          (data) => {
            if (data.popupBlocking === "specific-elements") {
              return data.cssSelectors?.trim() !== "";
            }
            return true;
          },
          {
            message: t("addPage.simple.validation.cssSelectorsRequired"),
            path: ["cssSelectors"],
          }
        ),
    [t]
  );

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      popupBlocking: "omit-popups",
      cssSelectors: "",
    },
  });

  const popupBlocking = watch("popupBlocking");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // First capture the page for each selected device
      const captureResponse = await fetch(`/api/capturePage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: data.pageUrl,
          label: data.snapshotName,
          trackingId,
        }),
      });

      const responseData = await captureResponse.json();
      console.log(responseData);

      if (responseData.redirect) {
        router.push(responseData.redirect);
        return;
      }

      if (!captureResponse.ok) {
        throw new Error(`Failed to capture page`);
      }

      toast({
        title: t("addPage.simple.success.title"),
        description: t("addPage.simple.success.description"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error capturing page:", error);
      toast({
        title: t("addPage.simple.error.title"),
        description: t("addPage.simple.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("addPage.simple.back")}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("addPage.simple.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t("addPage.simple.instructions")}
                </p>
                <h4 className="font-medium pt-4">
                  {t("addPage.simple.yourPage")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("addPage.simple.pageUrl")}</Label>
                    <Input
                      type="text"
                      placeholder="https://example.com/page"
                      className="w-full p-2 rounded-md border bg-background"
                      {...register("pageUrl")}
                    />
                    {errors.pageUrl && (
                      <p className="text-sm text-red-500">
                        {errors.pageUrl.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>{t("addPage.simple.snapshotName")}</Label>
                    <Input
                      type="text"
                      placeholder="Landing Page"
                      className="w-full p-2 rounded-md border bg-background"
                      {...register("snapshotName")}
                    />
                    {errors.snapshotName && (
                      <p className="text-sm text-red-500">
                        {errors.snapshotName.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">
                  {t("addPage.simple.blockingPopups")}
                </h4>

                <RadioGroup
                  value={popupBlocking}
                  onValueChange={(value) =>
                    setValue(
                      "popupBlocking",
                      value as FormData["popupBlocking"],
                      {
                        shouldValidate: true,
                      }
                    )
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="omit-popups" id="omit-popups" />
                    <Label htmlFor="omit-popups">
                      {t("addPage.simple.popupOptions.omit")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dont-block" id="dont-block" />
                    <Label htmlFor="dont-block">
                      {t("addPage.simple.popupOptions.dontBlock")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="specific-elements"
                      id="specific-elements"
                    />
                    <Label htmlFor="specific-elements">
                      {t("addPage.simple.popupOptions.specific")}
                    </Label>
                  </div>
                </RadioGroup>
                {popupBlocking === "specific-elements" && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="css-selectors">
                      {t("addPage.simple.cssSelectors.label")}
                    </Label>
                    <Input
                      id="css-selectors"
                      placeholder={t("addPage.simple.cssSelectors.placeholder")}
                      {...register("cssSelectors")}
                    />
                    <p className="text-sm text-muted-foreground">
                      {t("addPage.simple.cssSelectors.help")}
                    </p>
                    {errors.cssSelectors && (
                      <p className="text-sm text-red-500">
                        {errors.cssSelectors.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {t("addPage.simple.continue")}
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
