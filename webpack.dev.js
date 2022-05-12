const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SSICompileWebpackplugin = require("ssi-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: {
		index: ["@babel/polyfill", "./src/index.js"],
	},
	output: {
		filename: "[name].bundle.js",
		publicPath: "",
	},
	mode: "development",
	devtool: "source-map",
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		port: 8080,
		open: true,
		// hot: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				include: path.resolve(__dirname, "src"),
				use: [
					"cache-loader",
					{
						loader: "babel-loader",
						options: {
							cacheDirectory: true,
							presets: [["@babel/preset-env", { targets: "> 0.25%, not dead, not IE 11" }]],
						},
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif|webp)$/,
				use: [
					"cache-loader",
					{
						loader: "url-loader",
						options: {
							// Inline files smaller than 10 kB (10240 bytes)
							limit: 10 * 1024,
						},
					},
				],
			},
			{
				test: /\.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "build/[name].[ext]",
						},
					},
				],
			},
			{
				test: /\.s(a|c)ss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader?url=false", "sass-loader"],
			},
		],
	},

	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ["index*", "support*", "css/index*", "runtime*", "vendors*"],
		}),
		new HtmlWebPackPlugin({
			template: "./src/main.html",
			filename: "./index.html",
			chunksSortMode: "none",
			// inject: false,
		}),
		new HtmlWebPackPlugin({
			template: "./src/support.html",
			filename: "./support.html",
			chunksSortMode: "none",
			// inject: false,
		}),
		new MiniCssExtractPlugin({
			filename: "./css/[name].css",
		}),

		new SSICompileWebpackplugin({
			localBaseDir: "/",
			minify: false,
			remoteBasePath: "https://covid.cdc.gov/covid-data-tracker/",
		}),
		new webpack.DefinePlugin({
			"process.env.API_URL": JSON.stringify(
				"https://grasp_internal_test.cdc.gov/CoronavirusInteractive/001_DEV_HHS/COVIDData/getAjaxData?id="
			),
		}),
	],
	// BACKUP 	"https://grasp_internal_test.cdc.gov/CoronavirusInteractive/001_DEV_HHS/COVIDData/getAjaxData?id="
	// "https://wipv-grsp-8.cdc.gov/CoronavirusInteractive/001_DEV_HHS/COVIDData/getAjaxData?id="

	resolve: {
		modules: [path.resolve(__dirname, "/src"), "node_modules/"],
		extensions: [".js", ".scss"],
	},
	node: {
		process: false,
		global: false,
		fs: "empty",
	},
};
