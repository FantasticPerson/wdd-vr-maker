const nativeRequire = window.native_require;
const path = nativeRequire("path");
const fs = nativeRequire("fs");

export default function copyVideoTmpToVideo(name) {
	return new Promise((resolve, reject) => {
		let src = path.resolve(window.electron_app_video_tmp, "./" + name);
		let dest = path.resolve(window.electron_app_video_path, "./" + name);
		fs.createReadStream(src).pipe(fs.createWriteStream(dest));
		resolve();
	});
}

export function copyVideo2TmpToVideo(name) {
	return new Promise((resolve, reject) => {
		let src = path.resolve(window.electron_app_video_tmp, "./" + name);
		let dest = path.resolve(window.electron_app_video_path, "./" + name);
		fs.copyFileSync(src, dest);
		resolve();
	});
}
