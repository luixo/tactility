import { getLintConfig } from "@luixo/configs";

export default getLintConfig({
	env: { browser: true, node: true },
	ignorePatterns: [".tanstack/**", "dist/**", "**/*.gen.*"],
	overrides: [
		{
			files: ["src/routes/**"],
			rules: {
				// Routes explicitly use consts before define
				"eslint/no-use-before-define": "off",
				// Route throw specific error object
				"typescript/only-throw-error": "off",
			},
		},
	],
	plugins: { tanstackRouter: true },
	rules: {
		// There are false positives on `z.foo().catch()`
		"unicorn/prefer-top-level-await": "off",
		// Counts from bun run lint before these overrides: 139 rule errors.
		// 1 error witnessed.
		"eslint/func-style": "off",
		// 3 errors witnessed.
		"eslint/init-declarations": "off",
		// 16 errors witnessed.
		"eslint/no-bitwise": "off",
		// 5 errors witnessed.
		"eslint/no-console": "off",
		// 29 errors witnessed.
		"eslint/no-magic-numbers": "off",
		// 11 errors witnessed.
		"eslint/sort-keys": "off",
		// 2 errors witnessed.
		"import/no-nodejs-modules": "off",
		// 2 errors witnessed.
		"import/no-relative-parent-imports": "off",
		// 11 errors witnessed.
		"node/no-process-env": "off",
		// 5 errors witnessed.
		"react/hook-use-state": "off",
		// 4 errors witnessed.
		"react/jsx-no-literals": "off",
		// 2 errors witnessed.
		"typescript/no-misused-promises": "off",
		// 2 errors witnessed.
		"typescript/no-unnecessary-condition": "off",
		// 5 errors witnessed.
		"typescript/no-unsafe-assignment": "off",
		// 2 errors witnessed.
		"typescript/only-throw-error": "off",
		// 15 errors witnessed.
		"typescript/strict-boolean-expressions": "off",
		// 8 errors witnessed.
		"typescript/strict-void-return": "off",
	},
});
