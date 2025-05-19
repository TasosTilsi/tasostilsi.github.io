
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Enables static HTML export
  basePath: '/tasostilsi.github.io', // Set to your repository name
  assetPrefix: '/tasostilsi.github.io', // Ensure assets are served correctly
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export if using next/image
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'tasostilsi.github.io',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;