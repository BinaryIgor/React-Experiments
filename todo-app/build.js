import { build } from "esbuild";

build({
  entryPoints: ["src/index.jsx"],
  outfile: "dist/bundle.js",
  bundle: true,
  sourcemap: true,
  minify: true,
  loader: { ".css": "text" },
  define: { "process.env.NODE_ENV": '"production"' },
  target: ["esnext"],
}).catch(() => process.exit(1));