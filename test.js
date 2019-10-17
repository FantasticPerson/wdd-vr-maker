const fs = require("fs");

const copyPath = async function(src, dst) {
	if (fs.statSync(src).isFile()) {
		fs.copyFileSync(src, dst);
	} else {
		let exists = fs.existsSync(dst);
		if (!exists) {
			fs.mkdirSync(dst);
		}
		let paths = fs.readdirSync(src);
		paths.forEach(async function(path) {
			var _src = src + "\\" + path;
			var _dst = dst + "\\" + path;
			var stats = fs.statSync(_src);
			if (stats.isFile()) {
				fs.copyFileSync(_src, _dst);
			} else {
				copyPath(_src, _dst);
			}
		});
	}
};

copyPath(__dirname + "\\public", __dirname + "\\public2");

console.log("finish");
