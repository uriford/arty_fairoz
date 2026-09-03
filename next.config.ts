import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gcwzyolvayrnskfwjfiu.supabase.co",
        pathname: "/storage/v1/object/public/artworks/**",
      },
      {
        protocol: "https",
        hostname: "gcwzyolvayrnskfwjfiu.supabase.co",
        pathname: "/storage/v1/object/sign/commission-references/**",
      },
    ],
  },
};

export default nextConfig;
