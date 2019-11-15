import Timer from "./timer";
const fs = require("fs");
const Path = require("path");

function copyPath(path, dest) {
	copy(path, dest);
	return new Promise(resolve => {
		Timer(200).then(() => {
			resolve();
		});
	});
}

function copy(src, dst) {
	if (fs.statSync(src).isFile()) {
		fs.copyFileSync(src, dst);
	} else {
		let exists = fs.existsSync(dst);
		if (!exists) {
			fs.mkdirSync(dst);
		}
		let paths = fs.readdirSync(src);
		paths.forEach(path => {
			var _src = Path.join(src, path);
			var _dst = Path.join(dst, path);
			var stats = fs.statSync(_src);
			if (stats.isFile()) {
				fs.copyFileSync(_src, _dst);
			} else {
				copy(_src, _dst);
			}
		});
	}
}

export default copyPath;
