const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
      {
        source: '/sanctum/csrf-cookie',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sanctum/csrf-cookie`,
      },
      {
        source: '/login',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`,
      },
      {
        source: '/register',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`,
      },
      {
        source: '/storage/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' 
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;