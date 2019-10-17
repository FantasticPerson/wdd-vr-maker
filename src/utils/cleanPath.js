const fs = require("fs");

let depth = 0;

function cleanPath(path, callback) {
	depth = 0;
	clean(path, callback);
}

function clean(path, callback) {
	var files = [];
	depth++;
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file) {
			var curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) {
				clean(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
	depth--;
	if (depth == 0) {
		console.log("finish");
		callback();
	}
}

export default cleanPath;
