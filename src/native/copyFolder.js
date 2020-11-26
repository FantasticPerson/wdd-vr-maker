let fs = window.native_require("fs");

export default function copyFile(from, to) {
    let pathArr = [];
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to);
    }
    const getPaths = (p) => {
        let paths = fs.readdirSync(p);
        for (let i = 0; i < paths.length; i++) {
            let dPth = p + "\\" + paths[i];
            let stats = fs.statSync(dPth);
            if (stats.isFile()) {
                pathArr.push(dPth);
            } else {
                let destPath = dPth.replace(from, to);
                if (!fs.existsSync(destPath)) {
                    fs.mkdirSync(destPath);
                }
                getPaths(dPth);
            }
        }
    };
    getPaths(from);

    for (let i = 0; i < pathArr.length; i++) {
        let destFilePath = pathArr[i].replace(from, to);
        if (!fs.existsSync(destFilePath)) {
            fs.copyFileSync(pathArr[i], destFilePath);
        }
    }
}
