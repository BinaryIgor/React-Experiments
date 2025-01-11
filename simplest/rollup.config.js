import css from "rollup-plugin-import-css";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";

  // "devDependencies": {
  //   "@babel/core": "^7.26.0",
  //   "@babel/preset-react": "^7.26.3",
  //   "@rollup/plugin-babel": "^6.0.4",
  //   "@rollup/plugin-commonjs": "^28.0.2",
  //   "@rollup/plugin-node-resolve": "^16.0.0",
  //   "@rollup/plugin-replace": "^6.0.2",
  //   "rollup": "^4.30.1",
  //   "rollup-plugin-import-css": "^3.5.8"
  // },

export default {
	input: "src/index.js",
	output: {
		file: "dist/bundle.js",
		format: "es"
	},
	plugins: [
		css(),
		nodeResolve({
			extensions: [".js", ".jsx"]
		}),
		babel({
			babelHelpers: "bundled",
			presets: ["@babel/preset-react"],
			extensions: [".js", ".jsx"]
		}),
		commonjs(),
		replace({
			preventAssignment: true,
			'process.env.NODE_ENV': JSON.stringify(process.env.ENV || 'production'),
		}),
	]
}