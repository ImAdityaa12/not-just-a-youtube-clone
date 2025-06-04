import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        dangerouslyAllowSVG: true,
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
