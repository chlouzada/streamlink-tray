/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:1420',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
