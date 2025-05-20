/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nopzpxrhrcerdfnecoqd.supabase.co",
      },
    ],
  },
};

export default nextConfig;
