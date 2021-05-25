import { createAction } from "redux-act";

import Modals from "../modals";
import { addHotspotToKrpano, selectHotspotInKrpano, removeHotspotFromKrpano, updateHotspotIcon, updateHotspotText } from "../utils/krpanoFunctions";
import { getHotspotPath } from "../utils/pathUtils";
import Hashid from "../utils/generateHashId";

export const dAddHotpot = createAction("add_hotpot");
export const dDeleteHotpot = createAction("delete_hotpot");
export const dUpdateAllHotpot = createAction("update_all_hotpot");
export const dUpdateHotpotSelect = createAction("update_hotpot_select");

export function updateAllHotspot(sId = null) {
	return (dispatch, getState) => {
		let selectSceneId = sId == null ? getState().scene.sceneSelected : sId;
		Modals.Hotpot.findBySceneId(selectSceneId).then((list) => {
			list.sort((item1, item2) => {
				return item1.timestamp > item2.timestamp;
			});

			dispatch(dUpdateAllHotpot(list));
		});
	};
}

export function updateAllHotspotBySceneItem(sItem, mH,du) {
	return async (dispatch, getState) => {
		let pathname = getState().router.location.pathname;
		let vrId = pathname.split("/")[2];
		if (vrId) {
			let vrItems = await Modals.Vr.findAll();
			if (!vrItems) return;
			let vrItem = vrItems.find((item) => item.id == vrId);
			if (!vrItem) return;
			let sceneList = await Modals.Scene.findAllSceneById(vrItem.id);
			if (!sceneList) return;
			for (let i = 0; i < sceneList.length; i++) {
				let hotspots = await Modals.Hotpot.findBySceneId(sceneList[i].id);
				hotspots.map((item) => {
					let actionObj = JSON.parse(item.action);
					if (actionObj.type == "switch" && actionObj.toItem.id == sItem.id) {
						actionObj.toItem.name = sItem.name;
						actionObj.title = sItem.name;
					}
					mH({ ...item, action: JSON.stringify(actionObj) });
                    du();
					// modifyHotspot({ ...item, action: JSON.stringify(actionObj) });
					// updateAllHotspot();
				});
			}
		}
	};
}

export function updateHotspotSelect(id) {
	return (dispatch, getState) => {
		var krpano = getState().krpano.obj;
		if (krpano) {
			selectHotspotInKrpano(krpano, id);
			dispatch(dUpdateHotpotSelect(id));
		}
	};
}

export function updateHotspotPosition(obj) {
	return (dispath, getState) => {
		Modals.Hotpot.update(obj).then(() => {
			dispath(updateAllHotspot());
		});
	};
}

export function addHotspots(sId = null) {
	return (dispatch, getState) => {
		let krpano = getState().krpano.obj;
		if (krpano) {
			let sceneSelected = sId == null ? getState().scene.sceneSelected : sId;
			if (sceneSelected) {
				Modals.Hotpot.findBySceneId(sceneSelected).then((list) => {
					list.map((item) => {
						let icon = getHotspotPath(item.icon);
						addHotspotToKrpano(krpano, { ...item, _id: item.id, icon: icon }, false);
						setTimeout(() => {
							let title = JSON.parse(item.action).title;
							updateHotspotText(krpano, item._id, title);
						}, 50);
					});
				});
				dispatch(updateAllHotspot(sceneSelected));
			}
		}
	};
}

export function addHotspot(actionData, icon) {
	return (dispatch, getState) => {
		var krpano = getState().krpano.obj;
		var selectSceneId = getState().scene.sceneSelected;
		if (krpano && selectSceneId != -10) {
			let data = {
				_id: `hs${new Hashid().encode()}`,
				ath: krpano.get("view.hlookat"),
				atv: krpano.get("view.vlookat"),
				icon: icon,
				animated: true,
				type: undefined,
				typeProps: "",
				action: actionData,
			};

			Modals.Hotpot.add({ ...data, sceneId: selectSceneId, id: data._id }).then(() => {
				let icon = getHotspotPath(data.icon);
				dispatch(updateAllHotspot());

				addHotspotToKrpano(krpano, { ...data, icon: icon }, false);
				setTimeout(() => {
					let title = JSON.parse(data.action).title;
					updateHotspotText(krpano, data._id, title);
				}, 50);
				updateHotspotSelect(data.id);
			});
		}
	};
}

export function delHotspot(id) {
	return (dispatch, getState) => {
		var krpano = getState().krpano.obj;
		var selectSceneId = getState().scene.sceneSelected;
		if (krpano) {
			Modals.Hotpot.delete(id).then(() => {
				dispatch(updateAllHotspot());
				removeHotspotFromKrpano(krpano, id);
			});
		}
	};
}

export function modifyHotspot(obj, updateIcon) {
	console.log(obj);
	return (dispatch, getState) => {
		var krpano = getState().krpano.obj;
		var selectSceneId = getState().scene.sceneSelected;
		if (krpano) {
			Modals.Hotpot.update(obj)
				.then((item) => {
					console.log("afterItem", item);
					return Modals.Hotpot.findBySceneId(selectSceneId);
				})
				.then((list) => {
					let icon = getHotspotPath(obj.icon);
					dispatch(updateAllHotspot());
					let title = JSON.parse(obj.action).title;
					updateHotspotText(krpano, obj.id, title);
					updateHotspotIcon(krpano, obj.id, icon, true);
				});
		}
	};
}
