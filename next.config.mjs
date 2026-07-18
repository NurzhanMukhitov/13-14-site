import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    // Явно указываем корень проекта для Turbopack,
    // чтобы он не поднимался до /Users/nmk_one и искал зависимости здесь.
    root: __dirname,
  },
};

export default nextConfig;

