/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jfhtl3qu86.ufs.sh", // Add the first hostname
      },
      {
        protocol: "https",
        hostname: "utfs.io", // Add the second hostname
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/a/**", // Use a static pathname or adjust as needed
      },
    ],
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
};



export default nextConfig;