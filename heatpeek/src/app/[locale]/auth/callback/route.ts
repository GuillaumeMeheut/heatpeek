import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getErrorRedirect, getStatusRedirect } from "@/lib/utils";
import { getI18n } from "@locales/server";

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const t = await getI18n();

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          error.name,
          t("auth.card.error")
        )
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/sites`,
      t("global.successTitle"),
      t("auth.card.successSignIn")
    )
  );
}
