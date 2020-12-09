import { getPanoTool, getTmpPreviewPath } from "./pathUtils";
import cleanPath from "../utils/cleanPath";
const spawn = window.native_require("child_process").spawn;
const path = window.native_require("path");
const fs = window.native_require("fs");
const gm = require("gm");
const cPTmep = window.electron_app_cpano_path;

export default function createPano(src) {
	return cleanPath(cPTmep).then(_ => {
		if (!fs.existsSync(cPTmep)) {
			fs.mkdirSync(cPTmep);
		}

		let dest = path.resolve(cPTmep, "./origin.jpg");
		fs.createReadStream(src).pipe(fs.createWriteStream(dest));

		let tool = getPanoTool();
		let originPath = path.resolve(cPTmep, "./origin.jpg");

		let cmd = spawn(tool, ["sphere2cube", "cube", `${originPath}`, `${cPTmep}/mobile`]);
		let cmd2 = spawn(tool, ["makepreview", `${originPath}`]);

		let cmd1Promise = execCMD(cmd, 1);
		let cmd2Promise = new Promise(resolve => {
			execCMD(cmd2, 2).then(_ => {
				let previewPath = getTmpPreviewPath();
				// let writeStream = fs.createWriteStream(previewPath);
				// gm(previewPath)
				// 	.resize("512", "512")
				// 	.stream()
				// 	.pipe(writeStream);
				resolve();
			});
		});
		return Promise.all([cmd1Promise, cmd2Promise]);
	});
}

function execCMD(cmd) {
	return new Promise(resolve => {
		cmd.on("close", _ => {
			resolve();
        });
	});
}
