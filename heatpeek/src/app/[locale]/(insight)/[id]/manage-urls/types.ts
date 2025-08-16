import { TranslationFunction } from "@/types/translate";
import z from "zod";

export const urlAddSchema = (t: TranslationFunction) =>
  z.object({
    url: z
      .string()
      .min(1, t("urlManagement.validation.urlRequired"))
      .url(t("urlManagement.validation.invalidUrl"))
      .max(200, t("urlManagement.validation.urlTooLong")),
    label: z
      .string()
      .max(20, t("urlManagement.validation.labelTooLong"))
      .optional(),
    projectId: z.string(),
    sensitiveElement: z
      .string()
      .max(200, "Max 200 characters")
      .optional()
      .transform((val) =>
        val
          ? val
              .split(",")
              .map((element) => element.trim())
              .filter(Boolean)
          : []
      ),
    excludeElements: z
      .string()
      .max(200, "Max 200 characters")
      .optional()
      .transform((val) =>
        val
          ? val
              .split(",")
              .map((element) => element.trim())
              .filter(Boolean)
          : []
      ),
  });

export const urlUpdateSchema = (t: TranslationFunction) =>
  urlAddSchema(t).omit({ url: true, projectId: true });
