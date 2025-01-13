// @ts-check
import pkg from './next-i18next.config.js';
const { i18n } = pkg;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'leoffer-media.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/*/**',
      },
      {
        protocol: 'https',
        hostname: 'photos.platform.kwibal.com',
        port: '',
        pathname: '/*/**',
      },
    ],
    domains: [
      'leoffer-media.s3.ap-south-1.amazonaws.com',
      'photos.le-offers.com',
      'photo.le-offers.com',
      'photo.le-offers.comhttps',
      'photo.le-offers.comlisting',
      'upload.wikimedia.org',
      'media.istockphoto.com',
      'images.unsplash.com',
      'cdn.britannica.com',
      'media.istockphoto.com',
      'assets.le-offers.com',
      'le-offers-v2.gumlet.io',
      'photos.le-offers.com',
      'leoffer-images.s3.ap-south-1.amazonaws.com',
      'photos.platform.kwibal.com',
      'ideal-excitement-d2904ea8a5.media.strapiapp.com',
      'kwibal-images.s3.us-west-2.amazonaws.com',
    ],
  },
  i18n,
  async rewrites() {
    return [
      {
        source: '/sitemap/:file*.xml',
        destination: 'https://assets.platform.kwibal.com/sitemap/:file*.xml',
      },
    ];
  },

};

export default nextConfig;
