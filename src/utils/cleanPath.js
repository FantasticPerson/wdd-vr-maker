const fs = require("fs");

function cleanPath(path) {
	var files = [];
	if (fs.existsSync(path)) {
		let stats = fs.statSync(path);
		if (stats.isFile()) {
			fs.unlinkSync(path);
		} else {
			files = fs.readdirSync(path);
			files.forEach(function(file) {
				var curPath = path + "/" + file;
				if (fs.statSync(curPath).isDirectory()) {
					cleanPath(curPath);
				} else {
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}
}

export default cleanPath;
