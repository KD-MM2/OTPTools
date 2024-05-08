import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},

	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
			includeAssets: [
				"logo.svg",
				"pwa-64x64.png",
				"pwa-192x192.png",
				"pwa-512x512.png",
				"maskable-icon-512x512.png",
			],
			manifest: {
				name: "OTP Tools",
				short_name: "OTPTools",
				description: "One-Time Password Tools",
				theme_color: "#8936FF",
				background_color: "#2EC6FE",
				icons: [
					{
						src: "logo.svg",
						sizes: "512x512",
						type: "image/svg+xml",
					},
					{
						src: "pwa-64x64.png",
						sizes: "64x64",
						type: "image/png",
					},
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
});
