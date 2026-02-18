/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 이미지 최적화 캐시가 app.asar 내부를 건드리지 않도록 비활성화 (Electron 권장)
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      if (!config.externals) config.externals = [];
      if (Array.isArray(config.externals)) {
        config.externals.push("better-sqlite3");
      } else {
        config.externals = { ...config.externals, "better-sqlite3": "commonjs better-sqlite3" };
      }
    }
    return config;
  },
  typescript: { ignoreBuildErrors: true },
  // eslint 키를 제거하고 경고를 없앱니다 (Next 15+ 대응)
};

export default nextConfig;