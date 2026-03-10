import library from "@repo/eslint-config/library.js";

export default [
  ...library,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];