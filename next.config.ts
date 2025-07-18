import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.mux.com',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
            },
        ],
    },
    /* config options here */
};

export default nextConfig;
