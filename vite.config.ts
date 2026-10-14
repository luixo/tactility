import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { analyzer, unstableRolldownAdapter } from "vite-bundle-analyzer";
import chromeDevtools from "vite-plugin-devtools-json";
import importGraph from "vite-plugin-import-graph";

const useAnalyzer = Boolean(process.env["ANALYZER"]);

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		devtools(),
		chromeDevtools(),
		...(useAnalyzer
			? [unstableRolldownAdapter(analyzer()), importGraph()]
			: []),
		tanstackStart(),
		viteReact({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		tailwindcss(),
	],
});
