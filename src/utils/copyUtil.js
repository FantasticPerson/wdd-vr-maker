import Hashid from "./generateHashId";
import copyPath from "../utils/copyPath";
import clearDir from "../native/clearDir";


const nativeRequire = window.native_require;
const path = nativeRequire("path");
const fs = nativeRequire("fs")

export function moveImgToImage(src) {
	let extension = src.substr(src.lastIndexOf(".") + 1);
	let id = `img${new Hashid().encode()}`;
	let Imgdest = path.resolve(window.electron_app_pic_path, "./" + id + "." + extension);

	return new Promise(resolve => {
		copyPath(src, Imgdest).then(_ => resolve);
	});
}

// export function copyImageTmpToImage(name) {
// 	let src = path.resolve(window.electron_app_pic_tmp, "./" + name);
// 	let dest = path.resolve(window.electron_app_pic_path, "./" + name);

// 	return new Promise(resolve => {
// 		copyPath(src, dest).then(_ => resolve);
// 	});
// }

export function copyImageTmpToImage(name) {
    return new Promise((resolve, reject) => {
        let src = path.resolve(window.electron_app_pic_tmp, "./" + name);
        let dest = path.resolve(window.electron_app_pic_path, "./" + name);
        fs.createReadStream(src).pipe(fs.createWriteStream(dest));
        resolve();
    });
}

// export function copyImagaToTmpImage(filePath) {
// 	let extension = filePath.substr(filePath.lastIndexOf(".") + 1);
// 	let id = `img${new Hashid().encode()}`;
// 	let destPath = path.resolve(window.electron_app_pic_tmp, "./" + id + "." + extension);
// 	return new Promise(resolve => {
// 		copyPath(filePath, destPath).then(_ => resolve);
// 	});
// }


export function copyImagaToTmpImage(filePath) {
    let extension = filePath.substr(filePath.lastIndexOf(".") + 1);
    return new Promise((resolve, reject) => {
        clearDir(window.electron_app_pic_tmp).then(() => {
            let id = `img${new Hashid().encode()}`;
            let destPath = path.resolve(window.electron_app_pic_tmp, "./" + id + "." + extension);
            fs.createReadStream(filePath).pipe(fs.createWriteStream(destPath));
            resolve(`${id}.${extension}`);
        });
    });
}