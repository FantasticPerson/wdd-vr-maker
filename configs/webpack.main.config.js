/**
 * Base webpack config used across other specific configs
 */

import path from "path";
import webpack from "webpack";
import { dependencies } from "../package.json";
import TerserPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export default {
	externals: [...Object.keys(dependencies || {})],
	devtool: "source-map",
	mode: "production",
	target: "electron-main",
	entry: "./app/index.js",
	output: {
		path: path.join(__dirname, ".."),
		filename: "./app/index.prod.js"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true
					}
				}
			}
		]
	},
	output: {
		path: path.join(__dirname, "..", "app"),
		libraryTarget: "commonjs2"
	},
	resolve: {
		extensions: [".js", ".jsx", ".json"]
	},
	optimization: {
		minimizer: process.env.E2E_BUILD
			? []
			: [
					new TerserPlugin({
						parallel: true,
						sourceMap: true,
						cache: true
					})
			  ]
	},
	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: "production"
		}),
		new webpack.NamedModulesPlugin(),
		new BundleAnalyzerPlugin({
			analyzerMode: process.env.OPEN_ANALYZER === "true" ? "server" : "disabled",
			openAnalyzer: process.env.OPEN_ANALYZER === "true"
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: "production",
			DEBUG_PROD: false,
			START_MINIMIZED: false
		})
	],
	node: {
		__dirname: false,
		__filename: false
	}
};
