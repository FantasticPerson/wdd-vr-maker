import clearDir from "./clearDir";
import Hashid from "../utils/generateHashId";
const nativeRequire = window.native_require;
const path = nativeRequire("path");
const fs = nativeRequire("fs");

export default function copyImagaToTmpImage(filePath) {
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

export function clearTmpPath() {
    return clearDir(window.electron_app_pic_tmp);
}

export function copyImgToTmp(filePath) {
    let extension = filePath.substr(filePath.lastIndexOf(".") + 1);
    return new Promise((resolve, reject) => {
        let id = `img${new Hashid().encode()}`;
        let destPath = path.resolve(window.electron_app_pic_tmp, "./" + id + "." + extension);
        fs.copyFileSync(filePath, destPath);
        // fs.createReadStream(filePath).pipe(fs.createWriteStream(destPath));
        resolve(`${id}.${extension}`);
    });
}
// export default function copyImagaToTmpImage2(filePath) {
//     let extension = filePath.substr(filePath.lastIndexOf(".") + 1);
//     return new Promise((resolve, reject) => {
//         let id = `img${new Hashid().encode()}`;
//         let destPath = path.resolve(window.electron_app_pic_tmp, "./" + id + "." + extension);
//         fs.createReadStream(filePath).pipe(fs.createWriteStream(destPath));
//         resolve(`${id}.${extension}`);
//     });
// }
