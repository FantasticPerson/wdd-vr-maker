import Common from "../utils/common";
const path = window.native_require("path");
const xmlBuilder = require("xmlbuilder");

export function builder(data) {
	const krpano = xmlBuilder.create("krpano");

	const include = krpano.ele("include");
	include.att("url", "default");
	const skinSetting = krpano.ele("skin_settings");
	const settingData = data.setting;

	Object.keys(settingData).forEach((key) => {
		skinSetting.att(key, settingData[key]);
	});
}

export function getPanoXml(data) {
	console.log("getPanoXml");
	const krpano = xmlBuilder.create("krpano");
	krpano.att("version", Common.KR_VERSION);

	const scene = krpano.ele("scene");
	scene.att("name", "scene_0");

	const preview = scene.ele("preview");
	preview.att("url", "");

	const view = scene.ele("view");

	view.att("fovtype", "MFOV");
	view.att("fovmin", 70);
	view.att("fovmax", 140);
	view.att("limitview", "lookat");
	if (data.sceneItem) {
		const image = scene.ele("image");
		image.att("type", "CUBE");

		image.att("multires", "true");
		if ((data.sceneItem.athmutiInfos || [])[0]) {
			image.att("tilesize", data.sceneItem.mutiInfos[0].size);
		} else {
			image.att("tilesize", "512");
		}

		for (let i = 0; i < (data.sceneItem.mutiInfos || []).length; i++) {
			const level = image.ele("level");
			level.att("tiledimagewidth", data.sceneItem.mutiInfos[data.sceneItem.mutiInfos.length - i - 1].width);
			level.att("tiledimageheight", data.sceneItem.mutiInfos[data.sceneItem.mutiInfos.length - i - 1].height);

			const cube = level.ele("cube");
			cube.att("url", `${data.scenePath}/%s/l${data.sceneItem.mutiInfos[i].level}/%v/l${data.sceneItem.mutiInfos[i].level}_%s_%v_%h.jpg`);
		}
	}
	return krpano.doc().end();
}

export function getProductionXml(vrItem, sceneList, hotpotList, groupList, allSceneList) {
	let productData = krpanoData(vrItem, sceneList, hotpotList, groupList, allSceneList);

	const krpano = xmlBuilder.create("krpano");
	krpano.att("version", Common.KR_VERSION);
	krpano.att("clientVersion", Common.KR_VERSION);

	const includeFeatureElement = krpano.ele("include");
	includeFeatureElement.att("url", "./api_export.xml");

	const displayModeElement = krpano.ele("displayMode");
	displayModeElement.att("export", true);

	productData.groups.map((group) => {
		group.scene.map((item) => {
			getSceneXmlData(item, krpano);
		});
	});

	configXmlData(productData, krpano);

	let xml = krpano.doc().end();

	return xml;
}

function krpanoData(vrItem, sceneList, hotpotList, groupList, allSceneList) {
	let sceneArr = [];

	let outPut = [];

	for (let i = 0; i < groupList.length; i++) {
		let result = [];
		let groupItem = groupList[i];
		let ids = groupItem.sceneListIds || [];
		let scenes = [];
		ids.map((item) => {
			let sItem = allSceneList.find((item2) => item2.id == item);
			if (sItem) {
				scenes.push(sItem);
			}
		});
		if (scenes.length > 0) {
			for (let j = 0; j < scenes.length; j++) {
				let hotspots = getHotspotList(hotpotList, scenes[j].id);
				result.push({ scene: scenes[j], hotspots: hotspots });
			}
			outPut.push({ group: groupList[i], scene: result });
		}
	}
	return { item: vrItem, groups: outPut };

	function getHotspotList(list, id) {
		return list.filter((item) => {
			return item.sceneId == id;
		});
	}
}

function getSceneXmlData(pano, krpano) {
	const scene = krpano.ele("scene");
	scene.att("name", `scene_${pano.scene.id}`);
	scene.att("pano_id", pano.scene.id);

	const preview = scene.ele("preview");
	preview.att("url", `./scene_${pano.scene.id}/preview.jpg`);

	const image = scene.ele("image");
	image.att("type", "CUBE");
	image.att("multires", true);
	if ((pano.scene.mutiInfos || [])[0]) {
		image.att("tilesize", pano.scene.mutiInfos[0].size);
	} else {
		image.att("tilesize", "512");
	}

	console.log(pano);

	for (let i = 0; i < (pano.scene.mutiInfos || []).length; i++) {
		let multiItem = pano.scene.mutiInfos[i];
		const level = image.ele("level");
		level.att("tiledimagewidth", multiItem.width);
		level.att("tiledimageheight", multiItem.height);

		const cube = level.ele("cube");
		cube.att("url", `./scene_${pano.scene.id}/%s/l${pano.scene.mutiInfos[pano.scene.mutiInfos.length - i - 1].level}/%v/l${pano.scene.mutiInfos[pano.scene.mutiInfos.length - i - 1].level}_%s_%v_%h.jpg`);
	}

	for (let i = 0; i < pano.hotspots.length; i++) {
		const hotspot = scene.ele("hotspot");
		hotspot.att("name", `hotspot_${i}`);
	}
}

function configXmlData(productData, krpano) {
	const config = krpano.ele("config");
	infoXmlData(productData, config);
	authXmlData(productData, config);
	thumbsXmlData(productData, config, krpano);
	panosXmlData(productData, config);
	featureXmlData(productData, config);
}

function infoXmlData(productData, config) {
	const info = config.ele("info");
	info.att("id", productData.item.id);
	info.att("title", productData.item.title);
	info.att("desc", productData.item.brief);
}

function authXmlData(productData, config) {
	const auth = config.ele("auth");
	auth.att("auth_name", "中威科技");
}

function featureXmlData(productData, configXmlNode) {
	const feature = configXmlNode.ele("feature");

	// feature.att('enable_gyro', 1)
	// feature.att("enable_littleplanet", 1);
	// feature.att('enable_autorotate', 1)
	feature.att("enable_vr", 1);
}

function thumbsXmlData(productData, config, krpano) {
	const thumbs = config.ele("thumbs");
	thumbs.att("title", "全景列表");
	thumbs.att("show_thumb", 2);

	let useSunlight = false;

	productData.groups.map((group, i) => {
		let category = thumbs.ele("category");
		category.att("name", `category${i}`);
		category.att("title", group.group.title);
		category.att("thumb", `./scene_${group.scene[0].scene.id}/thumb.jpg`);

		group.scene.map((pano, i) => {
			let panoElement = category.ele("pano");
			panoElement.att("name", `pano_${pano.scene.id}`);
			panoElement.att("title", pano.scene.name);

			panoElement.att("thumb", `./scene_${pano.scene.id}/thumb.jpg`);
			panoElement.att("pano_id", pano.scene.id);

			if (pano.scene.hasOwnProperty("sunlight") && pano.scene.sunlight && pano.scene.sunlight.length > 0) {
				useSunlight = true;
			}
		});
	});

	if (useSunlight) {
		const includeFeatureElement = krpano.ele("include");

		includeFeatureElement.att("url", "./krp/lensflare/lensflare.xml");
	}
}

function panosXmlData(productData, config) {
	const panos = config.ele("panos");
	productData.groups.map((group) => {
		group.scene.map((pano) => {
			const panoElement = panos.ele("pano");
			panoElement.att("name", `scene_${pano.scene.id}`);

			const info = panoElement.ele("info");
			info.att("pano_id", pano.scene.id);
			info.att("title", pano.scene.name);
			console.log(pano.scene);
			const view = panoElement.ele("view");
			view.att("hloolat", pano.scene.hlookat || 0);
			view.att("vloolat", pano.scene.vlookat || 0);
			view.att("fov", pano.scene.fov || 75);
			view.att("fovtype", "MFOV");
			view.att("maxpixelzoom", 2.0);
			view.att("fovmin", pano.scene.fovmin || -5);
			view.att("fovmax", pano.scene.fovmax || 155);
			view.att("vlookatmin", pano.scene.vlookatmin || -90);
			view.att("vlookatmax", pano.scene.vlookatmax || 90);

			view.att("autorotatekeepview", 0);
			view.att("loadscenekeepview", 0);

			let startImagePc = panoElement.ele("start_image_pc");
			let startImageMobile = panoElement.ele("start_image_mobile");

			// startImagePc.att("url", `./scene_${pano.scene.id}/thumb.jpg`);
			// startImageMobile.att("url", `./scene_${pano.scene.id}/thumb.jpg`);

			const hotspots = panoElement.ele("hotspots");

			let hotspotIndex = 0;
			pano.hotspots.map((hotspotData) => {
				let actionObj = JSON.parse(hotspotData.action);
				const hotspot = hotspots.ele("hotspot");
				hotspot.att("name", `hotspot_${hotspotIndex}`);
				hotspotIndex++;

				let iconId = String(hotspotData.icon).length == 1 ? 0 + "" + hotspotData.icon : String(hotspotData.icon);
				if (hotspotData.animated) {
					hotspot.att("style_id", `new_spotd${iconId}`);
					hotspot.att("image_type", 1);
				} else {
					hotspot.att("image_type", 2);
					hotspot.att("image_url", `./krp/hotspotIcons/new_spotd01_gif.png`);
				}

				hotspot.att("ath", hotspotData.ath);
				hotspot.att("atv", hotspotData.atv);
				hotspot.att("show_txt", actionObj.check ? 1 : 0);
				hotspot.att("keep_view", 0);

				console.log(actionObj);
				switch (actionObj.type) {
					case "switch":
						hotspot.att("type", 0);
						hotspot.att("title", actionObj.title || "123");
						hotspot.att("url", actionObj.toItem.id);
						hotspot.att("blend", actionObj.switchType);
						break;
					case "link":
						hotspot.att("type", 1);
						hotspot.att("title", actionObj.title);
						hotspot.att("url", actionObj.url);
						hotspot.att("is_blank", actionObj.openInNewWindow ? 1 : 0);
						break;
					case "pictures":
						hotspot.att("type", 2);
						hotspot.att("title", actionObj.title);
						hotspot.att("url", actionObj.moreInfo ? actionObj.moreInfo : "");
						hotspot.att("is_blank", actionObj.openInNewWindow ? 1 : 0);
						let imageIndex = 0;
						actionObj.pics.map((item) => {
							const imageElement = hotspot.ele("image");
							imageElement.att("name", `image_${imageIndex}`);
							imageElement.att("title", "");
							imageElement.att("url", `./picture/${item.name}`);
							imageIndex++;
						});
						break;
					case "video":
						// const videoElement = hotspot.ele("video");
						// videoElement.att("name", actionObj.videoItem.showName);
						// videoElement.att("title", "");
						// videoElement.att("url", `./video/${actionObj.videoItem.name}`);
						hotspot.att("type", 3);
						hotspot.att("text", actionObj.url);
						hotspot.att("title", actionObj.title);
						hotspot.att("url", `./video/${actionObj.videoItem.name}`);
						hotspot.att("is_blank", actionObj.openInNewWindow ? 1 : 0);
						break;
					case "text":
						hotspot.att("type", 4);
						hotspot.att("text", actionObj.content);
						hotspot.att("title", actionObj.title);
						hotspot.att("url", actionObj.moreInfo);
						hotspot.att("is_blank", actionObj.openInNewWindow ? 1 : 0);
						break;
					case "audio":
						hotspot.att("type", 5);
						hotspot.att("title", actionObj.title);
						hotspot.att("url", `./audio/${actionObj.url}`);
						break;
					case "picAndText":
						hotspot.att("type", 6);
						hotspot.att("title", actionObj.title);
						hotspot.att("url", actionObj.moreInfo ? actionObj.moreInfo : "");
						hotspot.att("is_blank", actionObj.openInNewWindow ? 1 : 0);

						let mixIndex = 0;
						actionObj.picArr.map((item) => {
							const imageElement = hotspot.ele("image");
							imageElement.att("name", `image_${mixIndex}`);
							// imageElement.att("title", actionObj.title);
							imageElement.att("url", `./picture/${item.pic.name}`);
							imageElement.att("text", item.text);
							mixIndex++;
						});
						break;
					case "viewImage":
						hotspot.att("type", 7);
						hotspot.att("url", actionObj.moreInfo);
						hotspot.att("title", actionObj.title);
						hotspot.att("text", actionObj.summary);
						hotspot.att("is_blank", actionObj.openInNewWindow ? 1 : 0);
						const imageElement = hotspot.ele("image");
						imageElement.att("imagePath", actionObj.mediaId);
						imageElement.att("ext", "." + actionObj.ext);
						imageElement.att("size", actionObj.size);
						break;
					default:
						break;
				}
			});
			if (pano.scene.music1) {
				const sound = panoElement.ele("sound");
				sound.att("url", `./audio/${pano.scene.music1.url}`);
			}

			if (pano.scene.music2) {
				const voice = panoElement.ele("voice");
				voice.att("url", `./audio/${pano.scene.music2.url}`);
			}

			if (pano.scene.hasOwnProperty("effectLevel") && pano.scene.hasOwnProperty("effectType")) {
				if (parseInt(pano.scene.effectLevel) > 0) {
					const weather = panoElement.ele("weather");
					if (pano.scene.effectType == "rain") {
						weather.att("id", 1);
						weather.att("size", parseInt(pano.scene.effectLevel));
					} else {
						weather.att("id", 0);
						weather.att("size", parseInt(pano.scene.effectLevel));
					}
				}
			}
			if (pano.scene.hasOwnProperty("sunlight")) {
				if (pano.scene.sunlight && pano.scene.sunlight.length > 0) {
					let sunlightObj = JSON.parse(pano.scene.sunlight);
					const sunlight = panoElement.ele("sun");

					sunlight.att("enabled", 1);
					sunlight.att("id", 2);
					sunlight.att("ath", sunlightObj.ath);
					sunlight.att("atv", sunlightObj.atv);
				}
			}
			if (pano.scene.sandObj) {
				let sand = JSON.parse(pano.scene.sandObj);
				const sandTable = panoElement.ele("radar");
				sandTable.att("enabled", 1);
				sandTable.att("opened", 1);
				let imgSrc = sand.picItem.name;
				sandTable.att("map_url", `./picture/${imgSrc}`);
				let mark = sand.marks.find((item) => item.id == pano.scene.id);
				if (mark) {
					sandTable.att("x", mark.x);
					sandTable.att("y", mark.y);
					sandTable.att("heading_offset", mark.rotate);
				}
				let marks = sand.marks.filter((item) => item.id !== pano.scene.id) || [];
				marks.map((item) => {
					const sandTableSpot = sandTable.ele("radarspot");
					sandTableSpot.att("name", `r${item.id}`);
					sandTableSpot.att("title", item.name);
					sandTableSpot.att("x", item.x);
					sandTableSpot.att("y", item.y);
					sandTableSpot.att("linkedscene", item.id);
				});
			}
		});
	});
}
