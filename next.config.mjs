/** @type {import('next').NextConfig} */
const nextConfig = {
    // Expose environment variables to the client-side code
    env: {
      API_URL: process.env.API_URL,
    },
  };
  
  export default nextConfig;
  