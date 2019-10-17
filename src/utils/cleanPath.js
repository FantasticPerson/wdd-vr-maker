import Timer from "./timer";
const fs = require("fs");
const Path = require("path");

function cleanPath(path) {
	clean(path);
	return new Promise(resolve => {
		Timer(200).then(() => {
			resolve();
		});
	});
}

function clean(path) {
	var files = [];
	if (fs.existsSync(path)) {
		let stats = fs.statSync(path);
		if (stats.isFile()) {
			fs.unlinkSync(path);
		} else {
			files = fs.readdirSync(path);
			files.forEach(file => {
				var curPath = Path.join(path, file);
				if (fs.statSync(curPath).isDirectory()) {
					clean(curPath);
				} else {
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}
}

export default cleanPath;
