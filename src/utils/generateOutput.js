import { getScenePath } from "./pathUtils";
import { IMG_NAME_ARR } from "../constants.js";
import { getProductionXml } from "./xmlBuilder";

import copyFolder from "../native/copyFolder";

const { native_require, electron_app_output_path, electron_app_pic_path, electron_app_audio_path, electron_app_root_path, electron_app_krpano_path, electron_app_krp_assets_path } = window;

const fse = require("fs-extra");
const fs = native_require("fs");
const path = native_require("path");
const swig = require("swig");

export function GenerateOutput(vrItem, sceneList, hotpotList, groupList, allSceneList, cb) {
	let vrPath = path.resolve(electron_app_output_path, `./vr-${vrItem.id}`);

	let picPath = path.resolve(vrPath, "./picture");
	let audioPath = path.resolve(vrPath, "./audio");
	let scenePathArr = [];
	let hotspots = [];
	let picArr = [];
	let audioArr = [];
	let medias = [];
    if (vrItem.foreImageMobile) {
		picArr.push(vrItem.foreImageMobile.name);
	}
	if (vrItem.foreImagePC) {
		picArr.push(vrItem.foreImagePC.name);
	}
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
					picArr.push(list[j].name);
				}
			}
		} else if (actionObj.type == "picAndText") {
			let list = actionObj.picArr;
			for (let j = 0; j < list.length; j++) {
				if (picArr.indexOf(list[j].pic.name) < 0) {
					picArr.push(list[j].pic.name);
				}
			}
		} else if (actionObj.type == "audio") {
			audioArr.push(actionObj.url);
		} else if (actionObj.type == "viewImage") {
			let list = actionObj.picArr;
			medias.push({ mId: actionObj.mediaId, imgs: list });
		}
	}

	if (fs.existsSync(vrPath)) {
		fse.removeSync(vrPath);
	}

	if (!fs.existsSync(vrPath)) {
		fs.mkdirSync(vrPath);
	}

	for (let i = 0; i < medias.length; i++) {
		let viMitem = medias[i];
		let destPath = path.resolve(vrPath, `./${viMitem.mId}`);
		if (!fs.existsSync(destPath)) {
			fs.mkdirSync(destPath);
		}
		let imgList = viMitem.imgs;
		let afix = "png";
		if (imgList.length > 0) {
			afix = imgList[0].name.split(".").pop();
		}
		for (let i = 0; i < imgList.length; i++) {
			fse.copySync(path.resolve(electron_app_pic_path, `./${imgList[i].name}`), path.resolve(destPath, `./${imgList[i].showName + "." + afix}`));
		}
	}

	for (let i = 0; i < allSceneList.length; i++) {
		let scene = allSceneList[i];
		let srcPath = getScenePath(scene.id);
		let destPath = path.resolve(vrPath, `./scene_${scene.id}`);
		if (!fs.existsSync(destPath)) {
			fs.mkdirSync(destPath);
		}
		let sandObj = scene.sandObj;
		sandObj = sandObj ? JSON.parse(sandObj) : null;
		if (sandObj) {
			let pic = sandObj.picItem.name;
			if (picArr.indexOf(pic) < 0) {
				picArr.push(pic);
			}
		}
		for (let j = 0; j < IMG_NAME_ARR.length; j++) {
			if (IMG_NAME_ARR[j] == "origin_preview.jpg") {
				fse.copySync(path.resolve(srcPath, `./thumb.jpg`), path.resolve(destPath, `./thumb.jpg`));
			} else {
				fse.copySync(path.resolve(srcPath, `./${IMG_NAME_ARR[j]}`), path.resolve(destPath, `./${IMG_NAME_ARR[j]}`));
			}
			fse.copySync(path.resolve(srcPath, `./thumb.jpg`), path.resolve(destPath, `./preview.jpg`));
		}
		if (scene.music1) {
			audioArr.push(scene.music1);
		}
		if (scene.music2) {
			audioArr.push(scene.music2);
		}
	}
	audioArr = [...new Set(audioArr)];

	if (!fs.existsSync(picPath)) {
		fs.mkdirSync(picPath);
	}

	for (let i = 0; i < picArr.length; i++) {
		let srcPath = path.resolve(electron_app_pic_path, `./${picArr[i]}`);
		let destPath = path.resolve(picPath, `./${picArr[i]}`);
		fse.copySync(srcPath, destPath);
	}

	if (!fs.existsSync(audioPath)) {
		fs.mkdirSync(audioPath);
	}

	for (let i = 0; i < audioArr.length; i++) {
		let srcPath = path.resolve(electron_app_audio_path, `./${audioArr[i].url}`);
		let destPath = path.resolve(audioPath, `./${audioArr[i].url}`);
		fse.copySync(srcPath, destPath);
	}

	const template = swig.compileFile(path.resolve(electron_app_root_path, window.NODE_ENV == "prod" ? "../app.asar/build/pano.html" : "../public/pano.html"));

	let foreImagePCPath = vrItem.foreImagePC ? `./picture/${vrItem.foreImagePC.name}` : "";
	let foreImageMobile = vrItem.foreImageMobile ? `./picture/${vrItem.foreImageMobile.name}` : "";
	fs.writeFileSync(path.resolve(vrPath, "./index.html"), template({ title: vrItem.title, foreImagePC: foreImagePCPath, foreImageMobile }));

	fs.copyFileSync(path.resolve(electron_app_krpano_path, "./api_export.xml"), path.resolve(vrPath, "./api_export.xml"));

	fs.writeFileSync(path.resolve(vrPath, "./data.xml"), getProductionXml(vrItem, sceneList, hotpotList, groupList, allSceneList));

	fs.copyFileSync(path.resolve(electron_app_krp_assets_path, "./offline.js"), path.resolve(vrPath, "./offline.js"));

	fs.copyFileSync(path.resolve(electron_app_krp_assets_path, "./viewer.js"), path.resolve(vrPath, "./viewer.js"));

	fs.copyFileSync(path.resolve(electron_app_krpano_path, "./krpano.js"), path.resolve(vrPath, "./krpano.js"));

	fs.copyFileSync(path.resolve(electron_app_krpano_path, "./krpano.swf"), path.resolve(vrPath, "./krpano.swf"));

	copyFolder(electron_app_krp_assets_path, path.resolve(vrPath, "./krp"));
	copyFolder(path.resolve(electron_app_krp_assets_path, "./hotspotIcons"), path.resolve(vrPath, "./hotspots"));
}
