import { getScenePath } from "./pathUtils";
import { IMG_NAME_ARR } from "../constants.js";
import { getProductionXml } from "./xmlBuilder";

import copyFolder from "../native/copyFolder";
import copyPath from "../utils/copyPath";
import cleanPath from "../utils/cleanPath";

const { native_require, electron_app_output_path, electron_app_scene_path, electron_app_pic_path, electron_app_audio_path, electron_app_vr_path, electron_app_root_path } = window;

// const fse = native_require("fs-extra");
const fs = native_require("fs");
const path = native_require("path");
const swig = require("swig");

export async function GenerateOutput(vrItem, sceneList, hotpotList, groupList, allSceneList) {
	let config = {};
	let vrPath = path.resolve(electron_app_output_path, `./vr-${vrItem.id}`);

	let picPath = path.resolve(vrPath, "./picture");
	let audioPath = path.resolve(vrPath, "./audio");
	let scenePathArr = [];
	let hotspots = [];
	let picArr = [];
	let audioArr = [];
	for (let i = 0; i < allSceneList.length; i++) {
		scenePathArr.push(allSceneList[i].id);
	}
	for (let i = 0; i < allSceneList.length; i++) {
		for (let j = 0; j < hotpotList.length; j++) {
			if (hotpotList[j].sceneId == allSceneList[i].id) {
				hotspots.push(hotpotList[j]);
			}
		}
	}
	for (let i = 0; i < hotspots.length; i++) {
		let actionObj = JSON.parse(hotspots[i].action);
		if (actionObj.type == "pictures") {
			let list = actionObj.pics;
			for (let j = 0; j < list.length; j++) {
				if (picArr.indexOf(list[j]) < 0) {
					picArr.push(list[j]);
				}
			}
		} else if (actionObj.type == "picAndText") {
			let list = actionObj.picArr;
			for (let j = 0; j < list.length; j++) {
				if (picArr.indexOf(list[j].pic) < 0) {
					picArr.push(list[j].pic);
				}
			}
		} else if (actionObj.type == "audio") {
			audioArr.push(actionObj.url);
		}
	}

	if (fs.existsSync(vrPath)) {
		cleanPath(vrPath);
	}

	if (!fs.existsSync(vrPath)) {
		fs.mkdirSync(vrPath);
	}

	for (let i = 0; i < allSceneList.length; i++) {
		let scene = allSceneList[i];
		let srcPath = getScenePath(scene.id);
		let destPath = path.resolve(vrPath, `./scene_${scene.id}`);
		if (!fs.existsSync(destPath)) {
			fs.mkdirSync(destPath);
		}
		for (let j = 0; j < IMG_NAME_ARR.length; j++) {
			if (IMG_NAME_ARR[j] == "origin_preview.jpg") {
				copyPath(path.resolve(srcPath, `./thumb.jpg`), path.resolve(destPath, `./thumb.jpg`));
				// fse.copySync(path.resolve(srcPath, `./thumb.jpg`), path.resolve(destPath, `./thumb.jpg`));
			} else {
				copyPath(path.resolve(srcPath, `./${IMG_NAME_ARR[j]}`), path.resolve(destPath, `./${IMG_NAME_ARR[j]}`));
				// fse.copySync(path.resolve(srcPath, `./${IMG_NAME_ARR[j]}`), path.resolve(destPath, `./${IMG_NAME_ARR[j]}`));
			}
			copyPath(path.resolve(srcPath, `./thumb.jpg`), path.resolve(destPath, `./preview.jpg`));
			// fse.copySync(path.resolve(srcPath, `./thumb.jpg`), path.resolve(destPath, `./preview.jpg`));
			// fse.moveSync()
		}
	}

	if (!fs.existsSync(picPath)) {
		fs.mkdirSync(picPath);
	}

	for (let i = 0; i < picArr.length; i++) {
		let srcPath = path.resolve(electron_app_pic_path, `./${picArr[i]}`);
		let destPath = path.resolve(picPath, `./${picArr[i]}`);
		copyPath(srcPath, destPath);
		// fse.copySync(srcPath, destPath);
	}

	if (!fs.existsSync(audioPath)) {
		fs.mkdirSync(audioPath);
	}

	for (let i = 0; i < audioArr.length; i++) {
		let srcPath = path.resolve(electron_app_audio_path, `./${audioArr[i]}`);
		let destPath = path.resolve(audioPath, `./${audioArr[i]}`);
		copyPath(srcPath, destPath);

		// fse.copySync(srcPath, destPath);
	}
    
    console.log(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/html/pano.html" : "../public/pano.html"))
    const template = swig.compileFile(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/html/pano.html" : "../public/pano.html"));
    

	fs.writeFileSync(path.resolve(vrPath, "./index.html"), template({ title: vrItem.title }));

    fs.createReadStream(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/krpano/api_export_jiemi2.xml" : "../public/krpano/api_export_jiemi2.xml")).pipe(fs.createWriteStream(path.resolve(vrPath, "./api_export.xml")));
    

    // await copyPath()

    fs.writeFileSync(path.resolve(vrPath, "./data.xml"), getProductionXml(vrItem, sceneList, hotpotList, groupList, allSceneList));
    
    // await copyPath()

	fs.createReadStream(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/krp/offline.js" : "../public/krp/offline.js")).pipe(fs.createWriteStream(path.resolve(vrPath, "./offline.js")));

	fs.createReadStream(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/krp/viewer.js" : "../public/krp/viewer.js")).pipe(fs.createWriteStream(path.resolve(vrPath, "./viewer.js")));

	fs.createReadStream(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/krpano/krpano.js" : "../public/krpano/krpano.js")).pipe(fs.createWriteStream(path.resolve(vrPath, "./krpano.js")));

	fs.createReadStream(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/krpano/krpano.swf" : "../public/krpano/krpano.js")).pipe(fs.createWriteStream(path.resolve(vrPath, "./krpano.swf")));

	copyFolder(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/krp" : "../public/krp"), path.resolve(vrPath, "./krp"));

	copyFolder(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "./app.asar/krp/hotspotIcons" : "../public/krp/hotspotIcons"), path.resolve(vrPath, "./hotspots"));
}
