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

type CardSignProps = {
  isSignIn: boolean;
  onSubmit: (e: FormData) => void;
};

export default function CardSign({ isSignIn, onSubmit }: CardSignProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: FormData) => {
    startTransition(async () => {
      await onSubmit(e);
    });
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isSignIn ? "Sign in" : "Sign up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-1.5 mb-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>
            <div className="grid w-full items-center gap-1.5 mb-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
              />
            </div>
            <Button
              formAction={handleSubmit}
              className="mt-3 min-w-full"
              disabled={isPending}
            >
              {isSignIn ? "Sign in" : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator />
          <OauthSignIn />
          <p className="text-sm mt-2">
            {isSignIn ? (
              <>
                Don&apos;t have an account yet?{" "}
                <Link href={"/signup"} className="underline font-medium">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href={"/signin"} className="underline font-medium">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
