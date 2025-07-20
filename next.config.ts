import type {NextConfig} from 'next';

const isGithubPages = process.env.DEPLOY_ENV === 'GH_PAGES';
const repoName = 'cinelist';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'www.impawards.com',
      },
    ],
  },
};

export default nextConfig;
