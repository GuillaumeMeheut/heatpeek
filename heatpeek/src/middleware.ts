import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import { handleUrlFilters } from "@/lib/filter-middleware";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
  // First handle the session update
  const sessionResponse = await updateSession(request);

  // If session update returns a redirect or error response, return it immediately
  if (sessionResponse.status !== 200) {
    return sessionResponse;
  }

  // Handle URL filter rewriting
  const urlFilterResponse = handleUrlFilters(request);
  if (urlFilterResponse) {
    return urlFilterResponse;
  }

  // Handle i18n middleware for unmodified requests
  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - js files - .js
     * - api routes
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js)$).*)",
  ],
};
