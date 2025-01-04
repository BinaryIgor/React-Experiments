import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import terser from '@rollup/plugin-terser';

const environment = process.env.ENV;

export default {
	input: "src/index.js",
	output: {
		file: "dist/bundle.js",
		format: "es"
	},
	plugins: [
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
			preventAssignment: false,
			// TODO: shouldn't be prod?
			"process.env.NODE_ENV": `"${environment}"`	
		}),
		terser()
	]
}