await import( "./src/env.js" )

/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => {
    return [
      {
        source: '/api/trpc/*',
        destination: 'http://localhost:8000',
      },
    ];
  }
};

export default config;
