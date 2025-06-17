"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { getI18n } from "@locales/server";
import { signInSchema, signUpSchema } from "@/components/Auth/types";

export async function signIn(formData: FormData) {
  const t = await getI18n();
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validationResult = signInSchema(t).safeParse(data);

  if (!validationResult.success) {
    throw new Error(validationResult.error.errors[0].message);
  }

  const { error } = await supabase.auth.signInWithPassword(
    validationResult.data
  );

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/manage-sites", "layout");
  redirect("/manage-sites");
}

export async function signUp(formData: FormData) {
  const t = await getI18n();
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validationResult = signUpSchema(t).safeParse(data);

  if (!validationResult.success) {
    throw new Error(validationResult.error.errors[0].message);
  }

  const { data: signUpData, error } = await supabase.auth.signUp(
    validationResult.data
  );

  if (error) {
    throw new Error(error.message);
  }

  if (signUpData && signUpData.user) {
    // Check if the user got created
    if (signUpData.user.identities && signUpData.user.identities?.length > 0) {
      return {
        success: true,
        message: t("auth.card.successSignUp"),
      };
    } else {
      const t = await getI18n();
      // failed, the email address is taken
      throw new Error(t("auth.card.errorEmailTaken"));
    }
  }
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/signin");
}
