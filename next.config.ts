import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  // Allow dev origin for CORS during development
  allowedDevOrigins: ['http://172.16.1.81'],
};

export default nextConfig;