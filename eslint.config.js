const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    // Deno code (different runtime/globals, remote imports) — not part of
    // this project's TypeScript program.
    ignores: ["dist/*", ".expo/*", "node_modules/*", "supabase/functions/**"],
  },
];
