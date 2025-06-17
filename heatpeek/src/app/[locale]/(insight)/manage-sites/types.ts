import { TranslationFunction } from "@/types/translate";
import z from "zod";

export const WebsiteType = {
  SAAS: "SaaS",
  ECOMMERCE: "E-commerce",
  BLOG: "Blog",
  PORTFOLIO: "Portfolio",
  CORPORATE: "Corporate",
  OTHER: "Other",
};

export type WebsiteType = (typeof WebsiteType)[keyof typeof WebsiteType];

export const projectAddSchema = (t: TranslationFunction) =>
  z.object({
    label: z.string().max(40, t("projects.validation.labelTooLong")).optional(),
    type: z
      .enum([
        WebsiteType.SAAS,
        WebsiteType.ECOMMERCE,
        WebsiteType.BLOG,
        WebsiteType.PORTFOLIO,
        WebsiteType.CORPORATE,
        WebsiteType.OTHER,
      ])
      .nullable()
      .optional(),
    baseUrl: z
      .string()
      .min(1, t("projects.validation.baseUrlRequired"))
      .url(t("projects.validation.invalidUrl")),
  });

export const projectUpdateSchema = (t: TranslationFunction) =>
  projectAddSchema(t);
