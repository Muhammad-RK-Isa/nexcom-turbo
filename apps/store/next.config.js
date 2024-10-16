await import( "./src/env.js" )

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [
    "@nexcom/ui",
  ],
  eslint: { ignoreDuringBuilds: true },
  typescript: {ignoreBuildErrors: true},
};

export default config;
