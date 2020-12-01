let getPixels = require("get-pixels");

export default function checkSandPicValid(imgPath) {
    return new Promise((resolve, reject) => {
        getPixels(imgPath, function (err, pixels) {
            if (err) {
                reject("上传出错");
            }
            let shape = pixels.shape;
            console.log(shape);
            if (shape[0] != shape[1]) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}
