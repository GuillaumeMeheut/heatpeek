import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.PUBLIC_SITE_URL || "https://heatpeek.com";

  // Common routes that exist in all locales
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
        },
      },
    },
    {
      url: `${baseUrl}/why`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/why`,
          fr: `${baseUrl}/fr/why`,
        },
      },
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/pricing`,
          fr: `${baseUrl}/fr/pricing`,
        },
      },
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/en/signin`,
          fr: `${baseUrl}/fr/signin`,
        },
      },
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/en/signup`,
          fr: `${baseUrl}/fr/signup`,
        },
      },
    },
  ];

  // Add insight routes with alternates for different locales
  const insightRoutes = [
    {
      url: `${baseUrl}/manage-sites`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/manage-sites`,
          fr: `${baseUrl}/fr/manage-sites`,
        },
      },
    },
  ];

  // Add auth routes
  const authRoutes = [
    {
      url: `${baseUrl}/auth/confirm`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/auth/confirm`,
          fr: `${baseUrl}/fr/auth/confirm`,
        },
      },
    },
    {
      url: `${baseUrl}/auth/callback`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/auth/callback`,
          fr: `${baseUrl}/fr/auth/callback`,
        },
      },
    },
  ];

  // Combine all routes
  return [...routes, ...insightRoutes, ...authRoutes];
}
