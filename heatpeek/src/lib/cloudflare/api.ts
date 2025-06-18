export const purgeConfig = async (trackingId: string, path: string) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}api/project/config/purge?id=${trackingId}&p=${path}`,
    {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.INTERNAL_API_KEY!,
      },
    }
  );
};
