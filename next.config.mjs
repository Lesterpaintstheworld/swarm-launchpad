/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'picsum.photos'
        }],
    },
    webpack: config => {
        config.externals.push('pino-pretty', 'encoding')
        return config
    }
};

export default nextConfig;
