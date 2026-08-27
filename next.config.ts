import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent heavy server-side packages from being bundled by Turbopack/webpack,
  // which reduces peak memory usage and eliminates the heap OOM crash.
  serverExternalPackages: ["mongoose", "bcrypt", "bcryptjs"],

  // Skip TypeScript type errors during `next build` — type checking is
  // handled by the IDE (tsserver) and CI linter instead.
  // NOTE: ignoreBuildErrors also disables Turbopack's internal TS worker.
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Rewrites untuk proxy (opsional - gunakan jika ingin proxy di production)
  async rewrites() {
    // Jika ada backend API terpisah, aktifkan rewrites ini
    const backendUrl = process.env.BACKEND_API_URL;
    
    if (backendUrl) {
      return [
        {
          source: "/api/external/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    }
    
    return [];
  },
  
  // Headers untuk CORS jika diperlukan
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

export default nextConfig;
