import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/login",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/Login",
        destination: "/login",
      },
    ];
  },
};

module.exports = nextConfig;
