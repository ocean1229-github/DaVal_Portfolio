import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Notion SDK 호환성
  serverExternalPackages: ['@notionhq/client'],

  // 이미지 도메인 허용 (Notion 이미지용)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
