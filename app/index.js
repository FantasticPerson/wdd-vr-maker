const initServer = require("./server");

const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

const isDev = process.env.NODE_ENV == "development";

let window;

isDev && require("electron-debug")({ enabled: true, showDevTools: false });

function createDevTools() {
	const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require("electron-devtools-installer");
	const devtronExtension = require("devtron");
	devtronExtension.install();
	installExtension(REACT_DEVELOPER_TOOLS);
	installExtension(REDUX_DEVTOOLS);
}

function createWindow() {
	window = new BrowserWindow({
		width: 1240,
		height: 728,
		webPreferences: { nodeIntegration: true, webSecurity: false },
	});

	const devUrl = "http://localhost:3000";
	const localUrl = `file://${path.resolve(__dirname, "../../app.asar/build")}/index.html`;
	const appUrl = isDev ? devUrl : localUrl;
	if (!isDev) {
		window.setMenu(null);
	}
	window.loadURL(appUrl);
	if (isDev) {
		window.webContents.openDevTools();
	}
	window.on("closed", () => (window = null));

	const { globalShortcut } = require("electron");

	globalShortcut.register("ctrl+m", () => {
		window.webContents.openDevTools();
	});
}

const initConfig = async () => {
	global.__ELECTRON__ == true;
	global.electron = require("electron");
	global.electron_app = global.electron.app;

	global.electron_app_path = electron_app.getAppPath();

	if (isDev) {
		global.electron_app_root_path = path.resolve(electron_app.getPath("exe"), "../../../../dev");
		global.NODE_ENV = "dev";
		global.electron_app_public_path = path.resolve(global.electron_app_root_path, "../public");
	} else {
		global.electron_app_root_path = path.resolve(global.electron_app_path, "../public");
		global.NODE_ENV = "prod";
		global.electron_app_public_path = path.resolve(global.electron_app_path, "./build");
	}
	global.electron_app_assets_path = path.resolve(global.electron_app_root_path, "./assets");
	global.electron_app_assets_path = path.resolve(global.electron_app_root_path, "./assets");
	global.electron_app_krpano_path = path.resolve(global.electron_app_assets_path, "./krpano");
	global.electron_app_scene_path = path.resolve(global.electron_app_assets_path, "./scene");
	global.electron_app_tmp_path = path.resolve(global.electron_app_assets_path, "./tmp");
	global.electron_app_vr_path = path.resolve(global.electron_app_assets_path, "./vr");
	global.electron_app_krp_path = path.resolve(global.electron_app_public_path, "./krp");
	global.electron_app_krpano_path = path.resolve(global.electron_app_public_path, "./krpano");
	global.electron_app_pic_path = path.resolve(global.electron_app_assets_path, "./pic");
	global.electron_app_pic_tmp = path.resolve(global.electron_app_assets_path, "./picTmp");
	global.electron_app_video_path = path.resolve(global.electron_app_assets_path, "./video");
	global.electron_app_video_tmp = path.resolve(global.electron_app_assets_path, "./videoTmp");
	global.electron_app_audio_path = path.resolve(global.electron_app_assets_path, "./audio");
	global.electron_app_audio_tmp = path.resolve(global.electron_app_assets_path, "./audioTmp");
	global.electron_app_output_path = path.resolve(global.electron_app_assets_path, "./output");
	global.etectron_app_vr_output = path.resolve(global.electron_app_assets_path, "./vrOutput");
	global.electron_app_cpano_path = path.resolve(global.electron_app_root_path, "./cpano");
};

const copyFolder = (src, dst) => {
	let fs = require("fs");
	let stat = fs.stat;

	let copy = function (src, dst) {
		fs.readdir(src, function (err, paths) {
			if (err) {
				throw err;
			}
			paths.forEach(function (path) {
				var _src = src + "/" + path;
				var _dst = dst + "/" + path;
				var readable;
				var writable;
				stat(_src, function (err, st) {
					if (err) {
						throw err;
					}
					if (st.isFile()) {
						readable = fs.createReadStream(_src);
						writable = fs.createWriteStream(_dst);
						readable.pipe(writable);
					} else if (st.isDirectory()) {
						exists(_src, _dst, copy);
					}
				});
			});
		});
	};
	let exists = function (src, dst, callback) {
		fs.exists(dst, function (exists) {
			if (exists) {
				callback(src, dst);
			} else {
				fs.mkdir(dst, function () {
					callback(src, dst);
				});
			}
		});
	};
	exists(src, dst, copy);
};

const initDir = async () => {
	const checkAndMakeDir = (dir) => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
	};
	checkAndMakeDir(global.electron_app_root_path);
	checkAndMakeDir(global.electron_app_assets_path);
	checkAndMakeDir(global.etectron_app_vr_output);
	checkAndMakeDir(global.electron_app_output_path);
	checkAndMakeDir(global.electron_app_krpano_path);
	checkAndMakeDir(global.electron_app_scene_path);
	checkAndMakeDir(global.electron_app_tmp_path);
	checkAndMakeDir(global.electron_app_vr_path);
	checkAndMakeDir(global.electron_app_pic_path);
	checkAndMakeDir(global.electron_app_pic_tmp);
	checkAndMakeDir(global.electron_app_video_path);
	checkAndMakeDir(global.electron_app_video_tmp);
	checkAndMakeDir(global.electron_app_audio_path);
	checkAndMakeDir(global.electron_app_audio_tmp);
	checkAndMakeDir(global.electron_app_cpano_path);

	if (!isDev && !fs.existsSync(path.resolve(global.electron_app_path, "../tools"))) {
		let src = path.resolve(global.electron_app_path, "./build/tools");
		let dst = path.resolve(global.electron_app_path, "../tools");

		copyFolder(src, dst);
	}
};

const { globalShortcut } = require("electron");

const registerShortCuts = () => {
	globalShortcut.register("Ctrl+F1", () => {
		if (window) {
			window.webContents.openDevTools();
		}
	});
};

const unRegisterShortCuts = () => {
	globalShortcut.unregisterAll();
};

app.on("ready", async () => {
	await initConfig();
	await initDir();
	await initServer(global.electron_app_root_path, global);
	createWindow();
	isDev && createDevTools();
	registerShortCuts();

	if (window && !isDev) {
		window.on("blur", function () {
			let win = BrowserWindow.getFocusedWindow();
			if (win) return;
			unRegisterShortCuts();
		});

		window.on("focus", function () {
			registerShortCuts();
		});
	}
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	if (window === null) createWindow();
});
