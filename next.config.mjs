/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.safaricom.co.ke",
      },
    ],
  },
  // experimental: {
  //   ppr: "incremental",
  // },
};

export default nextConfig;
