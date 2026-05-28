export default [
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "coverage/**",
            "public/vendor/**",
        ],
    },
    {
        files: [
            "public/assets/js/**/*.js",
            "tests/**/*.js",
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                document: "readonly",
                window: "readonly",
                Event: "readonly",
                MouseEvent: "readonly",
                console: "readonly",
                URL: "readonly",
                process: "readonly",
            },
        },
        rules: {
            "no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "no-undef": "error",
            "no-console": "warn",
            "prefer-const": "error",
            "eqeqeq": [
                "error",
                "always",
            ],
        },
    },
];
