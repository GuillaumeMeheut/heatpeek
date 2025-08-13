import { Context } from "hono";

interface RequestWithCf extends Request {
  cf?: {
    country?: string;
    region?: string;
    city?: string;
    botManagement?: {
      score?: number;
      verifiedBot?: boolean;
    };
  };
}
export const getCfRequest = (c: Context) => {
  const req = c.req.raw as RequestWithCf;
  const cf = req.cf ?? {};
  const isBot = cf.botManagement?.verifiedBot ?? false;
  return {
    country: cf.country ?? null,
    region: cf.region ?? null,
    city: cf.city ?? null,
    isBot,
  };
};
