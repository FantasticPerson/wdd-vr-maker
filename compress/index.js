const images = require("images");
const path = require("path");
const fs = require("fs");

const scenePath = path.resolve(__dirname, "../");
const paths = fs.readdirSync(scenePath);
for (let i = 0; i < paths.length; i++) {
    let fPath = path.join(scenePath,paths[i])
	if (fs.statSync(fPath).isDirectory()) {
        console.log(paths[i])
        console.log(paths[i].indexOf)
		if (paths[i].indexOf("scene_scene") == 0) {
			let files = ["mobile_b.jpg", "mobile_d.jpg", "mobile_f.jpg", "mobile_l.jpg", "mobile_r.jpg", "mobile_u.jpg"];
			for (let j = 0; j < files.length; j++) {
				let inputPath = path.join(fPath, files[j]);
				let outputPath = path.join(fPath, files[j]);
				images(inputPath).size(2500).save(outputPath, {
					quality: 55,
				});
			}
		}
	}
}