import { z } from "zod";
import { TranslationFunction } from "@/types/translate";

export const signInSchema = (t: TranslationFunction) =>
  z.object({
    email: z.string().email({
      message: t("auth.card.validation.invalidEmail"),
    }),
    password: z.string().min(6, {
      message: t("auth.card.validation.passwordTooShort"),
    }),
  });

export const signUpSchema = (t: TranslationFunction) =>
  signInSchema(t)
    .extend({
      confirmPassword: z.string().min(6, {
        message: t("auth.card.validation.passwordTooShort"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.card.validation.passwordsDontMatch"),
      path: ["confirmPassword"],
    });
