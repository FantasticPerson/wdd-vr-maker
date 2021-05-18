import Modals from "../modals";
import { createAction } from "redux-act";
import { getPanoXml } from "../utils/xmlBuilder";
import { addHotspots } from "./hotpot";
import { getScenePath } from "../utils/pathUtils";
import { AddSunlight, RemoveSunlight } from "./krpano";
import { Modal } from "@material-ui/core";

export const updateAllScene = createAction("update_all_scene");
export const dUpdateSceneSelected = createAction("update_scene_selected");

export function updateDAllScene(id) {
	return (dispatch, getState) => {
		let pathname = getState().router.location.pathname;
		let vrId = pathname.split("/")[2];
		if (vrId) {
			Modals.Vr.findAll().then((items) => {
				var vrItem = items.find((item) => item.id == vrId);

				if (vrItem) {
					Modals.Scene.findAllSceneById(vrItem.id).then((list) => {
						list.sort((item1, item2) => {
							return item1.index > item2.index;
						});
						dispatch(updateAllScene(list));
					});
				}
			});
		}
	};
}

export function updateSceneSelected(id) {
	return (dispatch, getState) => {
		let sceneList = getState().scene.list;
		let sceneItem = sceneList.find((item) => item.id == id);

		let krpano = getState().krpano.obj;
		if (krpano) {
			let scenePath = getScenePath(id);
			if (krpano) {
				const xml = getPanoXml({
					sceneItem: sceneItem,
					scenePath: scenePath,
				});
				krpano.call(`load_pano_by_multils(${xml})`);
			}
			dispatch(dUpdateSceneSelected(id));
			dispatch(addHotspots(id));
		}
	};
}

export function updateInitViewPort(sceneId) {
	return (dispatch, getState) => {
		let krpano = getState().krpano.obj;
		let sceneList = getState().scene.list;
		let sceneItem = sceneList.find((item) => item.id == sceneId);

		if (krpano && sceneItem) {
			var hAov = krpano.get("view.hlookat");
			var vAov = krpano.get("view.vlookat");

			sceneItem.vlookat = vAov;
			sceneItem.hlookat = hAov;

			Modals.Scene.update(sceneItem).then(() => {
				dispatch(updateDAllScene());
			});
		}
	};
}

export function updateViewRange(id, fov, fovmax, fovmin, vlookatmin, vlookatmax) {
	return (dispatch, getState) => {
		let sceneList = getState().scene.list;
		let sceneItem = sceneList.find((item) => item.id == id);

		if (sceneItem) {
			sceneItem.fov = fov;
			sceneItem.fovmin = fovmin;
			sceneItem.fovmax = fovmax;
			sceneItem.vlookatmin = vlookatmin;
			sceneItem.vlookatmax = vlookatmax;

			Modals.Scene.update(sceneItem).then(() => {
				dispatch(updateDAllScene());
			});
		}
	};
}

export function updateEffect(id, type, level) {
	return (dispatch, getState) => {
		let sceneList = getState().scene.list;
		let sceneItem = sceneList.find((item) => item.id == id);

		if (sceneItem) {
			sceneItem.effectType = type;
			sceneItem.effectLevel = level;

			Modals.Scene.update(sceneItem).then(() => {
				dispatch(updateDAllScene());
			});
		}
	};
}

export function addSunlight(id) {
	return (dispatch, getState) => {
		let sceneList = getState().scene.list;
		let sceneItem = sceneList.find((item) => item.id == id);

		var krpano = getState().krpano.obj;

		if (sceneItem && krpano) {
			const ath = krpano.get("view.hlookat");
			const atv = krpano.get("view.vlookat");

			let newItem = { ...sceneItem, sunlight: JSON.stringify({ ath, atv }) };

			dispatch(AddSunlight({ ath, atv }));

			Modals.Scene.add(newItem).then(() => {
				dispatch(updateDAllScene());
			});
		}
	};
}

export function updateSand(oldObj, newObj, sceneId) {
	return (dispatch, getState) => {
		let sandObj = oldObj ? JSON.parse(oldObj) : null;
		let sceneList = getState().scene.list;
		if (!newObj) {
			let oldIds = [];
			if (sandObj) {
				oldIds = (sandObj.marks || []).map((item) => item.id);
			}
			oldIds.forEach((id) => {
				let sItem = sceneList.find((item) => item.id == id);
				if (!sItem) return;
				let sand = sItem.sandObj ? JSON.parse(sItem.sandObj) : null;
				if (!sand) return;
				let marks = (sand.marks || []).filter((item) => item.id != sceneId);
				Modals.Scene.add({ ...sItem, sandObj: JSON.stringify({ ...sand, marks: marks }) });
			});
			let oItem = sceneList.find((item) => item.id == sceneId);
			if (oItem) {
				Modals.Scene.add({ ...oItem, sandObj: null });
			}
		} else {
			let oldIds = [];
			if (sandObj) {
				oldIds = sandObj.marks.map((item) => item.id);
			}
			let newIds = newObj.marks.map((item) => item.id);
			let idsToDelete = oldIds.filter((item) => {
				return newIds.indexOf(item) < 0;
			});
			idsToDelete.map((id) => {
				let sItem = sceneList.find((item) => item.id == id);
				if (sItem) {
					Modals.Scene.add({ ...sItem, sandObj: null });
				}
			});
			newIds.map((id) => {
				let sItem = sceneList.find((item) => item.id == id);
				if (sItem) {
					Modals.Scene.add({ ...sItem, sandObj: JSON.stringify(newObj) });
				}
			});
			if (newIds.length == 0 || newIds.indexOf(sceneId) < 0) {
				let cItem = sceneList.find((item) => item.id == sceneId);
				if (cItem) {
					Modals.Scene.add({ ...cItem, sandObj: JSON.stringify(newObj) });
				}
			}
		}
		setTimeout(() => {
			dispatch(updateDAllScene());
		}, 100);
	};
}

export function updateSunlight(id, ath, atv) {
	return (dispatch, getState) => {
		let sceneList = getState().scene.list;
		let sceneItem = sceneList.find((item) => item.id == id);

		var krpano = getState().krpano.obj;

		if (sceneItem && krpano) {
			let newItem = { ...sceneItem, sunlight: JSON.stringify({ ath, atv }) };

			Modals.Scene.update(newItem).then(() => {
				dispatch(updateDAllScene());
			});
		}
	};
}

export function removeSunlight(id) {
	return (dispatch, getState) => {
		let sceneList = getState().scene.list;
		let sceneItem = sceneList.find((item) => item.id == id);

		var krpano = getState().krpano.obj;

		if (sceneItem && krpano) {
			let newItem = { ...sceneItem, sunlight: null };
			dispatch(RemoveSunlight());
			Modals.Scene.update(newItem).then(() => {
				dispatch(updateDAllScene());
			});
		}
	};
}

export function updateAllSceneFromLocal() {
	return (dispatch) => {
		dispatch(updateDAllScene());
	};
}

export function addScene(obj) {
	let sceneObj = {
		...obj,
		fov: 75,
		fovmax: 155,
		fovmin: -5,
		hlookat: 0,
		vlookat: 0,
		vlookatmax: 90,
		vlookatmin: -90,
	};
	return (dispatch) => {
		Modals.Scene.add(sceneObj).then(() => {
			dispatch(updateDAllScene());
		});
	};
}

export function delScene(obj) {
	return (dispatch) => {
		Modals.Scene.delete(obj.id).then(() => {
			dispatch(updateDAllScene());
		});
	};
}

export function modifyScene(obj) {
	return (dispatch) => {
		Modals.Scene.update(obj).then(() => {
			dispatch(updateDAllScene());
		});
	};
}

export function updateAllMusic(arr, music1, music2) {
	let objArr = arr.map((item) => {
		return { ...item, music1, music2 };
	});
	return (dispatch) => {
		Modals.Scene.updateAllScene(objArr).then(() => {
			dispatch(updateDAllScene());
		});
	};
}

export function updateSceneMusic(obj, music1, music2) {
	return (dispatch) => {
		Modals.Scene.update({ ...obj, music1, music2 }).then(() => {
			dispatch(updateDAllScene());
		});
	};
}
