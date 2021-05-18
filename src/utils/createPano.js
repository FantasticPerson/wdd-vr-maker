import { getPanoTool, getTmpPreviewPath } from "./pathUtils";
import cleanPath from "../utils/cleanPath";
const spawn = window.native_require("child_process").spawn;
const path = window.native_require("path");
const fse = window.native_require("fs-extra");
const fs = window.native_require("fs");
const gm = require("gm");
const cPTmep = window.electron_app_cpano_path;
const publicPath = window.electron_app_public_path;

const getTileInfo = (message) => {
	let matches = message.match(/- multires: tilesize[\s\S]+making/g) || [];
	let matchItem = matches[0];
	if (!matchItem) return;
	let level = (matchItem.match(/levels=[0-9]+/) || [])[0];
	if (!level) return;
	level = level.substr(7);
	let size = (matchItem.match(/tilesize=[0-9]+/) || [])[0];
	if (!size) return;
	size = size.substr(9);
	let imageSizes = matchItem.match(/[0-9]+x[0-9]+/g) || [];
	let multiInfo = [];
	for (let i = 0; i < level; i++) {
		let infoItem = imageSizes[i];
		if (!infoItem) return;
		let width = infoItem.substr(0, infoItem.length / 2);
		let height = infoItem.substr(Math.ceil(infoItem.length / 2));
		multiInfo.push({ level: 1 + i, size: size, width: width, height: height });
	}
	return multiInfo;
};

export default function createPano(src) {
	return cleanPath(cPTmep).then((_) => {
		if (!fs.existsSync(cPTmep)) {
			fs.mkdirSync(cPTmep);
		}
		console.log(publicPath);

		let isDev = window.NODE_ENV == "dev";
		let batPath = path.resolve(publicPath, "../../krpano-1.19/MAKE PANO (MULTIRES) droplet.bat");
		if (isDev) {
			batPath = path.resolve(publicPath, "./tools/krpano-1.19/MAKE PANO (MULTIRES) droplet.bat");
		}

		let dest = path.resolve(cPTmep, "./origin.jpg");
		// fs.createReadStream(src).pipe(fs.createWriteStream(dest));
		fse.copySync(src, dest);
		fse.removeSync(path.resolve(cPTmep, "./origin"));
		let tool = getPanoTool();
		let originPath = path.resolve(cPTmep, "./origin.jpg");
		console.log(window.NODE_ENV);
		// let cmd = spawn(tool, ["sphere2cube", "cube", `${originPath}`, `${cPTmep}/mobile`]);
		let cmd2 = spawn(tool, ["makepreview", `${originPath}`]);
		let multiInfos = [];
		const promise1 = new Promise((resolve, reject) => {
			const bat = spawn("cmd.exe", ["/c", batPath, originPath]);

			bat.stdout.on("data", (data) => {
				let message = data.toString();
				let infos = getTileInfo(message);
				if (infos) {
					multiInfos = infos;
				}
				console.log(data.toString());
			});

			bat.stderr.on("data", (data) => {
				console.error(data.toString());
			});

			bat.on("exit", (code) => {
				console.log(`Child exited with code ${code}`);
				if (code == 0) {
					console.log(multiInfos);
					// fse.copySync(path.resolve(devPath, "./origin"), path.resolve(devPath, "./origin2"));
					resolve(multiInfos);
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
