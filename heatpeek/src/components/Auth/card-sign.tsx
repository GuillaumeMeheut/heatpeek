"use client";

import { useTransition, useMemo } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import OauthSignIn from "./oauth-signin";
import { Label } from "../ui/label";
import Link from "next/link";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useI18n } from "@locales/client";

type CardSignProps = {
  isSignIn: boolean;
  onSubmit: (e: FormData) => void;
};

export default function CardSign({ isSignIn, onSubmit }: CardSignProps) {
  const [isPending, startTransition] = useTransition();
  const t = useI18n();

  const signInSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("auth.card.validation.invalidEmail")),
        password: z.string().min(6, t("auth.card.validation.passwordTooShort")),
      }),
    [t]
  );

  const signUpSchema = useMemo(
    () =>
      signInSchema
        .extend({
          confirmPassword: z
            .string()
            .min(6, t("auth.card.validation.passwordTooShort")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("auth.card.validation.passwordsDontMatch"),
          path: ["confirmPassword"],
        }),
    [signInSchema, t]
  );

  type SignInFormData = z.infer<typeof signInSchema>;
  type SignUpFormData = z.infer<typeof signUpSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData | SignUpFormData>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
  });

  const onFormSubmit = async (data: SignInFormData | SignUpFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(async () => {
      await onSubmit(formData);
    });
  };

  const renderConfirmPasswordField = () => {
    if (isSignIn) return null;

    const signUpErrors = errors as { confirmPassword?: { message?: string } };

    return (
      <div className="grid w-full items-center gap-1.5 mb-3">
        <Label htmlFor="confirmPassword">
          {t("auth.card.confirmPassword")}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t("auth.card.confirmPasswordPlaceholder")}
          {...register("confirmPassword" as keyof SignUpFormData)}
        />
        {signUpErrors.confirmPassword && (
          <p className="text-sm text-red-500">
            {signUpErrors.confirmPassword.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-sm mx-auto mb-40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isSignIn ? t("auth.card.signIn") : t("auth.card.signUp")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid w-full items-center gap-1.5 mb-3">
            <Label htmlFor="email">{t("auth.card.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.card.emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5 mb-3">
            <Label htmlFor="password">{t("auth.card.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("auth.card.passwordPlaceholder")}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          {renderConfirmPasswordField()}
          <Button
            type="submit"
            className="mt-3 min-w-full"
            disabled={isPending}
          >
            {isSignIn ? t("auth.card.signIn") : t("auth.card.signUp")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Separator />
        <OauthSignIn />
        <p className="text-sm mt-2">
          {isSignIn ? (
            <>
              {t("auth.card.noAccount")}
              <Link href={"/signup"} className="underline font-medium">
                {t("auth.card.signUpLink")}
              </Link>
            </>
          ) : (
            <>
              {t("auth.card.haveAccount")}
              <Link href={"/signin"} className="underline font-medium">
                {t("auth.card.signInLink")}
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
