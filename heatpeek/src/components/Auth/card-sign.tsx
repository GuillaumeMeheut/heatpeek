"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";

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

  const handleSubmit = async (e: FormData) => {
    startTransition(async () => {
      await onSubmit(e);
    });
  };

  return (
    <Card className="w-full max-w-sm mx-auto mb-40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isSignIn ? t("auth.card.signIn") : t("auth.card.signUp")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-1.5 mb-3">
            <Label htmlFor="email">{t("auth.card.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("auth.card.emailPlaceholder")}
            />
          </div>
          <div className="grid w-full items-center gap-1.5 mb-3">
            <Label htmlFor="password">{t("auth.card.password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder={t("auth.card.passwordPlaceholder")}
            />
          </div>
          <Button
            formAction={handleSubmit}
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
              {t("auth.card.noAccount")}{" "}
              <Link href={"/signup"} className="underline font-medium">
                {t("auth.card.signUpLink")}
              </Link>
            </>
          ) : (
            <>
              {t("auth.card.haveAccount")}{" "}
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
