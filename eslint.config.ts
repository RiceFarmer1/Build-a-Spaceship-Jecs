import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import roblox from "eslint-plugin-roblox-ts";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	roblox.configs.tsRecommendedCompat,
	roblox.configs.recommended,
	{
        rules: {
            "roblox-ts/lua-truthiness": "off",
            
        },
		files: ["**/*/*.?([cm])ts", "**/*/*.?([cm])tsx"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				projectService: {
					allowDefaultProject: ["*.ts"],
					defaultProject: "./tsconfig.json",
				},
			},
		},
	},
	globalIgnores(["out/**"]),
	prettier,
);
