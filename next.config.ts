// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    // Modify Webpack rules to handle TypeScript files if required
    config.module.rules.push({
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    });

    // Allow .ts, .tsx extensions to be resolved by Webpack
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};

export default nextConfig;
