/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure API routes are included in the build
  experimental: {
    outputFileTracingIncludes: {
      '/api/vehicles': ['./src/app/api/vehicles/route.js'],
    },
  },
};

module.exports = nextConfig;
