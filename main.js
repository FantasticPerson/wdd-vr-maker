const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");

let window;

isDev && require("electron-debug")({ enabled: true, showDevTools: false });

function createDevTools() {
	const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require("electron-devtools-installer");
	const devtronExtension = require("devtron");
	devtronExtension.install();
	installExtension(REACT_DEVELOPER_TOOLS);
	installExtension(REDUX_DEVTOOLS);
}

function copyFolder(src, dst) {
	let fs = require("fs");
	let stat = fs.stat;

	let copy = function(src, dst) {
		fs.readdir(src, function(err, paths) {
			if (err) throw err;
			paths.forEach(function(path) {
				let _src = src + "/" + path;
				let _dst = dst + "/" + path;
				let readable, writable;
				stat(_src, function(err, st) {
					if (err) throw err;
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
	let exists = function(src, dst, callback) {
		fs.exists(dst, function(exists) {
			if (exists) callback(src, dst);
			else {
				fs.mkdir(dst, function() {
					callback(src, dst);
				});
			}
		});
	};
	exists(src, dst, copy);
}

function createWindow() {
	window = new BrowserWindow({
		width: 1240,
		height: 728,
		webPreferences: { nodeIntegration: true, webSecurity: false }
	});

	const devUrl = "http://localhost:3000";
	const localUrl = `file://${path.resolve(__dirname, "../../app.asar/build")}/index.html`;
	const appUrl = isDev ? devUrl : localUrl;

	window.loadURL(appUrl);
	window.webContents.openDevTools();
	window.on("closed", () => (window = null));
}

const initConfig = async () => {
	global.__ELECTRON__ == true;
	global.electron = require("electron");
	global.electron_app = global.electron.app;
	global.electron_app_path = electron_app.getAppPath();
	if (isDev) {
		global.electron_app_root_path = path.resolve(electron_app.getPath("exe"), "../../../../dist");
		global.NODE_ENV = "dev";
	} else {
		global.electron_app_root_path = path.resolve(global.electron_app_path, "..");
		global.NODE_ENV = "prod";
	}
	global.electron_app_assets_path = path.resolve(global.electron_app_root_path, "./assets");
	global.electron_app_krpano_path = path.resolve(global.electron_app_assets_path, "./krpano");
	global.electron_app_scene_path = path.resolve(global.electron_app_assets_path, "./scene");
	global.electron_app_tmp_path = path.resolve(global.electron_app_assets_path, "./tmp");
	global.electron_app_vr_path = path.resolve(global.electron_app_assets_path, "./vr");
	global.electron_app_krp_path = path.resolve(global.electron_app_root_path, "../public/krp");
	global.electron_app_krpano_path = path.resolve(global.electron_app_root_path, "../../krpano");
	global.electron_app_pic_path = path.resolve(global.electron_app_assets_path, "./pic");
	global.electron_app_pic_tmp = path.resolve(global.electron_app_assets_path, "./picTmp");
	global.electron_app_audio_path = path.resolve(global.electron_app_assets_path, "./audio");
	global.electron_app_audio_tmp = path.resolve(global.electron_app_assets_path, "./audioTmp");
	global.electron_app_output_path = path.resolve(global.electron_app_assets_path, "./output");
	global.etectron_app_vr_output = path.resolve(global.electron_app_assets_path, "./vrOutput");
	global.electron_app_cpano_path = path.resolve(global.electron_app_root_path, "./cpano");
};

const initDir = async () => {
	const checkAndMakeDir = dir => {
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
	checkAndMakeDir(global.electron_app_audio_path);
	checkAndMakeDir(global.electron_app_audio_tmp);
	checkAndMakeDir(global.electron_app_cpano_path);

	if (global.NODE_ENV !== "dev" && !fs.exists(path.resolve(global.electron_app_root_path, "./tools"))) {
		let src = path.resolve(global.electron_app_root_path, "./app.asar/tools");
		let dst = path.resolve(global.electron_app_root_path, "./tools");

		copyFolder(src, dst);
	}
};

app.on("ready", async () => {
	await initConfig();
	await initDir();
	createWindow();
	isDev && createDevTools();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	if (window === null) createWindow();
});
