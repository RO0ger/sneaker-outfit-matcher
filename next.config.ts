import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        // Extracted from your SUPABASE_URL. If this is wrong, please update it.
        hostname: "rzxbcqtirvwgbl.supabase.co",
      },
    ],
  },
};

export default nextConfig;
