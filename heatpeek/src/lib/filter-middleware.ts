import { DeviceEnum } from "@/app/[locale]/(insight)/[id]/(data)/heatmap/types";
import { FilterDateEnum, FilterBrowserEnum } from "@/components/Filters/types";
import { type NextRequest, NextResponse } from "next/server";

interface FilterRule {
  parameter: string;
  defaultValue: string | undefined;
  allowedValues?: string[]; // Add allowed values for validation
  transformations?: Record<string, string>;
  routeSpecificTransformations?: Record<string, Record<string, string>>;
  routes?: {
    include?: string[];
    exclude?: string[];
  };
  routeSpecificDefaults?: Record<string, string | undefined>;
  // If defined, the parameter will be removed from the URL when the pathname matches any of these routes
  clearOnRoutes?: string[];
}

const filterRules: FilterRule[] = [
  {
    parameter: "device",
    defaultValue: DeviceEnum.Desktop,
    allowedValues: [DeviceEnum.Desktop, DeviceEnum.Tablet, DeviceEnum.Mobile], // Valid device values - removed "all"
    routeSpecificTransformations: {
      "/heatmap": {
        // Remove "all" transformation since we're not using it anymore
      },
    },
    routes: {
      include: ["/(data)", "/heatmap", "/dashboard"], // Include dashboard routes
    },
    routeSpecificDefaults: {
      "/dashboard": undefined, // Dashboard defaults to undefined (no filter)
    },
  },
  //For url filter check component FiltersUrl.tsx the default value doesnt apply for url
  {
    parameter: "url",
    defaultValue: undefined,
    routes: {
      include: ["/(data)", "/heatmap", "/dashboard"], // Include dashboard routes
    },
    routeSpecificDefaults: {
      "/dashboard": undefined, // Dashboard defaults to undefined (no filter) for url too
    },
  },
  {
    parameter: "date",
    defaultValue: FilterDateEnum.Last24Hours,
    allowedValues: [
      FilterDateEnum.Last24Hours,
      FilterDateEnum.Last7Days,
      FilterDateEnum.Last30Days,
      FilterDateEnum.Last90Days,
    ], // Valid date values
    routes: {
      include: ["/(data)", "/heatmap", "/dashboard"], // Include dashboard routes
    },
  },
  {
    parameter: "browser",
    defaultValue: undefined,
    allowedValues: [
      FilterBrowserEnum.Chrome,
      FilterBrowserEnum.Safari,
      FilterBrowserEnum.Firefox,
      FilterBrowserEnum.Edge,
      FilterBrowserEnum.Other,
    ], // Valid browser values
    routes: {
      include: ["/(data)", "/heatmap", "/dashboard"], // Include dashboard routes
    },
    routeSpecificDefaults: {
      "/dashboard": undefined, // Dashboard defaults to undefined (no filter)
    },
  },
  {
    parameter: "snapshotId",
    defaultValue: undefined,
    routes: {
      include: ["/(data)", "/heatmap", "/dashboard"], // Include dashboard routes
    },
    routeSpecificDefaults: {
      "/dashboard": undefined, // Dashboard defaults to undefined (no filter)
    },
    clearOnRoutes: ["/dashboard"], // Always clear snapshotId on dashboard
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

    // Generic handling: clear parameter when on specified routes
    if (
      rule.clearOnRoutes &&
      rule.clearOnRoutes.some((route) => pathname.includes(route)) &&
      params.has(rule.parameter)
    ) {
      params.delete(rule.parameter);
      modified = true;
      continue;
    }

    // Ensure parameter exists
    if (!params.has(rule.parameter)) {
      if (defaultValue !== undefined) {
        params.set(rule.parameter, defaultValue);
        modified = true;
      }
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

      // Validate the value against allowed values - only for included routes
      if (
        rule.allowedValues &&
        currentValue &&
        rule.routes?.include && // Only validate if routes are explicitly included
        !rule.allowedValues.includes(currentValue)
      ) {
        if (defaultValue !== undefined) {
          params.set(rule.parameter, defaultValue);
        } else {
          params.delete(rule.parameter);
        }
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
