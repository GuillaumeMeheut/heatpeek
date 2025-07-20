/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nopzpxrhrcerdfnecoqd.supabase.co",
      },
      {
        protocol: "https",
        hostname: "rkrkpchutofbpyqvniqq.supabase.co",
      },
    ],
  },
};

export default nextConfig;
