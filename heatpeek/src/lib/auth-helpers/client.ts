"use client";

import { type Provider } from "@supabase/supabase-js";
import { getURL } from "../utils";
import { createClient } from "../supabase/client";

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const provider = String(formData.get("provider")).trim() as Provider;

  const supabase = createClient();
  const redirectURL = getURL("/auth/callback");

  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectURL,
    },
  });
}
