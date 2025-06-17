import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStatusRedirect } from "@/lib/utils";
import { getI18n } from "@locales/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const t = await getI18n();

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      return NextResponse.redirect(
        getStatusRedirect(
          `${requestUrl.origin}/manage-sites`,
          t("global.successTitle"),
          t("auth.card.successConfirm")
        )
      );
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
