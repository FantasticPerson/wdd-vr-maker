let fs = window.native_require("fs");
let stat = fs.stat;

let copy = async (src, dst) => {
    let paths = fs.readdirSync(src)
    paths.forEach(async function(path) {
        let _src = src + "/" + path;
        let _dst = dst + "/" + path;
        let stats = fs.statSync(_src)
        if(stats.isFile()){
            await copyfile(_src,_dst)
        } else {
            exists(_src, _dst, copy);
        }
    });
};

const copyfile = (src, dst) => {
	return new Promise(resolve => {
		let readable = fs.createReadStream(src);
		let writable = fs.createWriteStream(dst);
		readable.pipe(writable);
		writable.on("end", resolve);
	});
};

let exists = function(src, dst, callback) {
	fs.exists(dst, function(exists) {
		if (exists) {
			callback(src, dst);
		} else {
			fs.mkdir(dst, function() {
				callback(src, dst);
			});
		}
	});
};

export default function copyFile(from, to) {
	exists(from, to, copy);
}
