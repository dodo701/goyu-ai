import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#11172d", muted: "#69728d", line: "#e9ecf5", lavender: "#7568f5", mint: "#42c7a8" }, boxShadow: { soft: "0 18px 50px rgba(27, 35, 75, .08)" } } },
  plugins: []
};
export default config;
