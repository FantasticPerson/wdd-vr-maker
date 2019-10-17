const fs = require("fs");
const copyPath = async function(src, dst,callback) {
	let paths = fs.readdirSync(src);
	paths.forEach(async function(path) {
		var _src = src + "/" + path;
        var _dst = dst + "/" + path;
        var stats = fs.statSync(_src)
        if(stats.isFile()){
            await copyFile(_src,_dst)
        } else {
            checkDirectory(_src, _dst, copyPath);
        }
    });
    callback &&　callback()
};
const checkDirectory = function(src, dst, callback) {
	fs.access(dst, fs.constants.F_OK, err => {
        if(err) fs.mkdirSync(dst); 
        callback(src, dst); 
	});
};

const copyFile = (src, dest) => {
	return new Promise((resolve) => {
		let readable = fs.createReadStream(src);
		let writable = fs.createWriteStream(dest);
		readable.pipe(writable);
        writable.on("end", resolve);
	});
};

export default copyPath;
