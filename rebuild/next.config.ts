import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL,
  },
};

export default nextConfig;
