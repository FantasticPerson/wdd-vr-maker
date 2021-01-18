import { getPanoTool, getTmpPreviewPath } from "./pathUtils";
import cleanPath from "../utils/cleanPath";
const spawn = window.native_require("child_process").spawn;
const path = window.native_require("path");
const fse = window.native_require("fs-extra");
const fs = window.native_require("fs");
const gm = require("gm");
const cPTmep = window.electron_app_cpano_path;
const publicPath = window.electron_app_public_path;


export default function createPano(src) {
	return cleanPath(cPTmep).then((_) => {
		if (!fs.existsSync(cPTmep)) {
			fs.mkdirSync(cPTmep);
        }
        console.log(publicPath)
        let batPath = path.resolve(publicPath, "./tools/krpano-1.19/MAKE PANO (MULTIRES) droplet.bat");
		let dest = path.resolve(cPTmep, "./origin.jpg");
		// fs.createReadStream(src).pipe(fs.createWriteStream(dest));
		fse.copySync(src, dest);
        fse.removeSync(path.resolve(cPTmep, "./origin"))
		let tool = getPanoTool();
		let originPath = path.resolve(cPTmep, "./origin.jpg");

		// let cmd = spawn(tool, ["sphere2cube", "cube", `${originPath}`, `${cPTmep}/mobile`]);
		let cmd2 = spawn(tool, ["makepreview", `${originPath}`]);

		const promise1 = new Promise((resolve, reject) => {
			const bat = spawn("cmd.exe", ["/c", batPath, originPath]);

			bat.stdout.on("data", (data) => {
				console.log(data.toString());
			});

			bat.stderr.on("data", (data) => {
				console.error(data.toString());
			});

			bat.on("exit", (code) => {
				console.log(`Child exited with code ${code}`);
				if (code == 0) {
					// fse.copySync(path.resolve(devPath, "./origin"), path.resolve(devPath, "./origin2"));
					resolve();
				} else {
					reject(code);
				}
			});
		});

		// let cmd1Promise = execCMD(cmd, 1);
		let cmd2Promise = new Promise((resolve) => {
			execCMD(cmd2, 2).then((_) => {
				let previewPath = getTmpPreviewPath();
				// let writeStream = fs.createWriteStream(previewPath);
				// gm(previewPath)
				// 	.resize("512", "512")
				// 	.stream()
				// 	.pipe(writeStream);
				resolve();
			});
		});
		return Promise.all([promise1, cmd2Promise]);
	});
}

function execCMD(cmd) {
	return new Promise((resolve) => {
		cmd.on("close", (_) => {
			resolve();
		});
	});
}
