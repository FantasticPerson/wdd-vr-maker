const nativeRequire = window.native_require;
const path = nativeRequire("path");
const fs = nativeRequire("fs");

export default function replaceImage(from, to) {
    // console.log(from, to);
    return new Promise((resolve) => {
        let src = path.resolve(window.electron_app_audio_tmp, "./" + from);
        let dest = path.resolve(window.electron_app_audio_path, "./" + to);
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest);
        }
        fs.copyFileSync(src, dest);
        resolve();
    });
}
