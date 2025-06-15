export const WebsiteType = {
  SAAS: "SaaS",
  ECOMMERCE: "E-commerce",
  BLOG: "Blog",
  PORTFOLIO: "Portfolio",
  CORPORATE: "Corporate",
  OTHER: "other",
} as const;

export type WebsiteType = (typeof WebsiteType)[keyof typeof WebsiteType];
