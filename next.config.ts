/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Vercel serverless compatibility
  output: "standalone",

  // Optional, but recommended for App Router
  reactStrictMode: true,
};

export default nextConfig;
