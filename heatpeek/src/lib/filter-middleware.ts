import { type NextRequest, NextResponse } from "next/server";

interface FilterRule {
  parameter: string;
  defaultValue: string;
  transformations?: Record<string, string>;
  routeSpecificTransformations?: Record<string, Record<string, string>>;
  routes?: {
    include?: string[];
    exclude?: string[];
  };
  routeSpecificDefaults?: Record<string, string>;
}

const filterRules: FilterRule[] = [
  {
    parameter: "device",
    defaultValue: "desktop",
    routeSpecificTransformations: {
      "/heatmap": {
        all: "desktop", // Convert "all" to "desktop" only for heatmap routes
      },
    },
    routes: {
      include: ["/(data)", "/heatmap", "/dashboard"], // Include dashboard routes
    },
    routeSpecificDefaults: {
      "/dashboard": "all", // Dashboard defaults to "all"
    },
  },
  //For url filter check component FiltersUrl.tsx the default value doesnt apply for url
  {
    parameter: "url",
    defaultValue: "",
    routes: {
      include: ["/(data)", "/heatmap", "/dashboard"], // Include dashboard routes
    },
    routeSpecificDefaults: {
      "/dashboard": "all", // Dashboard defaults to "all" for url too
    },
  },
];

export function handleUrlFilters(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const params = new URLSearchParams(searchParams.toString());
  let modified = false;

  for (const rule of filterRules) {
    // Check if this rule applies to the current route
    if (
      rule.routes?.exclude &&
      rule.routes.exclude.some((route) => pathname.includes(route))
    ) {
      continue; // Skip this rule for excluded routes
    }

    if (
      rule.routes?.include &&
      !rule.routes.include.some((route) => pathname.includes(route))
    ) {
      continue; // Skip this rule if not in included routes
    }

    // Determine the default value for this route
    let defaultValue = rule.defaultValue;
    if (rule.routeSpecificDefaults) {
      for (const [route, value] of Object.entries(rule.routeSpecificDefaults)) {
        if (pathname.includes(route)) {
          defaultValue = value;
          break;
        }
      }
    }

    // Ensure parameter exists
    if (!params.has(rule.parameter)) {
      params.set(rule.parameter, defaultValue);
      modified = true;
    } else {
      // Apply transformations if they exist
      const currentValue = params.get(rule.parameter);

      // Check for route-specific transformations first
      if (rule.routeSpecificTransformations && currentValue) {
        for (const [route, transformations] of Object.entries(
          rule.routeSpecificTransformations
        )) {
          if (pathname.includes(route) && transformations[currentValue]) {
            const newValue = transformations[currentValue];
            params.set(rule.parameter, newValue);
            modified = true;

            break;
          }
        }
      }
      // Fall back to global transformations
      else if (
        rule.transformations &&
        currentValue &&
        rule.transformations[currentValue]
      ) {
        const newValue = rule.transformations[currentValue];
        params.set(rule.parameter, newValue);
        modified = true;
      }
    }
  }

  // If we modified the URL, redirect to the updated URL
  if (modified) {
    const url = new URL(request.url);
    url.search = params.toString();
    return NextResponse.redirect(url);
  }

  return null; // No modification needed
}
