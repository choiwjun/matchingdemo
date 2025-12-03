/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        unoptimized: process.env.NODE_ENV === 'development',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    // Vercel 환경 최적화
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,
    
    // 환경변수 검증 비활성화 (빌드 시 DB 연결 불필요)
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;
