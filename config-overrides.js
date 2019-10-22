module.exports = function override(config, env) {
	if (env === "production") {
		config.output.publicPath = "./";
	}
	config.target = "electron-renderer";
	return config;
};
