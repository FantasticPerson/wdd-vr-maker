import Hashid from "./generateHashId";
import copyPath from "../utils/copyPath";

const nativeRequire = window.native_require;
const path = nativeRequire("path");

export function moveImgToImage(src) {
	let extension = src.substr(src.lastIndexOf(".") + 1);
	let id = `img${new Hashid().encode()}`;
	let Imgdest = path.resolve(window.electron_app_pic_path, "./" + id + "." + extension);

	return new Promise(resolve => {
		copyPath(src, Imgdest).then(_ => resolve);
	});
}

export function copyImageTmpToImage(name) {
	let src = path.resolve(window.electron_app_pic_tmp, "./" + name);
	let dest = path.resolve(window.electron_app_pic_path, "./" + name);

	return new Promise(resolve => {
		copyPath(src, dest).then(_ => resolve);
	});
}

export function copyImagaToTmpImage(filePath) {
	let extension = filePath.substr(filePath.lastIndexOf(".") + 1);
	let id = `img${new Hashid().encode()}`;
	let destPath = path.resolve(window.electron_app_pic_tmp, "./" + id + "." + extension);
	return new Promise(resolve => {
		copyPath(filePath, destPath).then(_ => resolve);
	});
}
