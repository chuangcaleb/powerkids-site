/** @type {import("prettier").Config} */
module.exports = {
  plugins: [
    // require.resolve("prettier-plugin-astro"),
    // require.resolve("prettier-plugin-tailwindcss"),
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  tabWidth: 2,
  singleQuote: false,
  astroAllowShorthand: false,
  tailwindConfig: './tailwind.config.ts',
};
