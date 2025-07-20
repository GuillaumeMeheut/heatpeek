import { Device } from "@/types/database";

export const purgeConfig = async (trackingId: string, path: string) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}api/project/config/purge`,
    {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.INTERNAL_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: trackingId,
        p: path,
      }),
    }
  );
};

export const purgeSnapshot = async (
  trackingId: string,
  path: string,
  device: Device | "all"
) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}api/project/snapshot/purge`,
    {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.INTERNAL_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: trackingId,
        p: path,
        d: device,
      }),
    }
  );
};
