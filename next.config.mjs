/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
      unoptimized: true, // Required for static export if using images
    },
  };
  
  export default nextConfig;
  