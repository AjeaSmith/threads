/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// more info - https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages
		serverComponentsExternalPackages: ["mongoose"],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
			{
				protocol: "https",
				hostname: "images.clerk.dev",
			},
			{
				protocol: "https",
				hostname: "utfs.io",
			},
			{
				protocol: "https",
				hostname: "placehold.co",
			},
		],
	},
};

export default nextConfig;
