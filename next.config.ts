import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "bcrypt", "bcryptjs"],

  typescript: {
    ignoreBuildErrors: true,
  },

  // Izinkan gambar dari backend (localhost:3001)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
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
