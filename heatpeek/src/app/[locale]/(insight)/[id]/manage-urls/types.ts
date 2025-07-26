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
  });

export const urlUpdateSchema = (t: TranslationFunction) =>
  urlAddSchema(t).omit({ url: true, projectId: true });
