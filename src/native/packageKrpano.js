import Hashid from "../utils/generateHashId";
import copyPath from "../utils/copyPath";
const nativeRequire = window.native_require;
const { dialog } = nativeRequire("electron");
let assetsPath = window.electron_app_assets_path;
let path = nativeRequire("path");
// const fse = require("fs-extra");

export default function packageKrpano(id) {
	let vrPath = path.resolve(window.electron_app_output_path, `./vr-${id}`);
	dialog.showOpenDialog({ properties: ["openDirectory"] }, function(p) {
		if (p && p.length >= 0) {
			let dPath = p[0];

			const dest = `vr-${id}-${new Hashid().encode()}`;

			copyPath(vrPath, path.resolve(dPath, dest));
		}
	});
}
