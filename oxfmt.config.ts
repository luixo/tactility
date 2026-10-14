import { getFormatConfig } from "@luixo/configs";

export default getFormatConfig({
	ignorePatterns: [".tanstack/**", ".output/**", "dist/**", "**/*.gen.ts"],
	imports: {
		internalPattern: ["~/**"],
		customGroups: [
			{
				groupName: "react-first",
				elementNamePattern: ["react", "react-dom/client"],
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
	},
	tailwind: {
		stylesheet: "./src/styles/app.css",
	},
});
