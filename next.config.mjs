/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        // Enables the styled-components plugin
        styledComponents: true,
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'picsum.photos'
        }],
    },
    webpack: config => {
        config.externals.push('pino-pretty', 'encoding')
        return config
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "frame-src 'self' x.com *.x.com twitter.com *.twitter.com;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
