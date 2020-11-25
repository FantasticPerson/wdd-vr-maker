const nativeRequire = window.native_require;
const path = nativeRequire("path");
const fs = nativeRequire("fs");

export default function copyImageTmpToImage(name) {
    return new Promise((resolve, reject) => {
        let src = path.resolve(window.electron_app_pic_tmp, "./" + name);
        let dest = path.resolve(window.electron_app_pic_path, "./" + name);
        fs.createReadStream(src).pipe(fs.createWriteStream(dest));
        resolve();
    });
}

export function copyImage2TmpToImage(name) {
    return new Promise((resolve, reject) => {
        let src = path.resolve(window.electron_app_pic_tmp, "./" + name);
        let dest = path.resolve(window.electron_app_pic_path, "./" + name);
        fs.copyFileSync(src, dest);
        resolve();
    });
}
