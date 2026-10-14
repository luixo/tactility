import { getFormatConfig } from "@luixo/configs";

export default getFormatConfig({
	ignorePatterns: [".tanstack/**", ".output/**", "dist/**", "**/*.gen.ts"],
	imports: {
		customGroups: [
			{
				elementNamePattern: ["react", "react-dom/client"],
				groupName: "react-first",
			},
		],
		groups: [
			"react-first",
			["builtin", "external"],
			"internal",
			"parent",
			"sibling",
			"index",
			"unknown",
		],
		internalPattern: ["~/**"],
	},
	tailwind: {
		stylesheet: "./src/styles/app.css",
	},
});
