import { createAction } from "redux-act";
import { addRainEffect, addSnowEffect, addSunlightToKrpano, removeSunlightFromKrpano } from "../utils/krpanoFunctions";

export const dUpdateKrpano = createAction("update_krpano");

export function updateKrpano(krpano) {
	return (dispatch) => {
		dispatch(dUpdateKrpano(krpano));
	};
}

export function AddEffect(type, level) {
	return (dispatch, getState) => {
		var krpano = getState().krpano.obj;
		if (krpano) {
			if (type == "rain") {
				addRainEffect(krpano, level);
			} else if (type == "snow") {
				addSnowEffect(krpano, level);
			}
		}
	};
}

export function AddSunlight(obj) {
	return (dispatch, getState) => {
		var krpano = getState().krpano.obj;
		if (krpano) {
			addSunlightToKrpano(krpano, obj.ath, obj.atv);
		}
	};
}

export function RemoveSunlight() {
	return (dispatch, getState) => {
		var krpano = getState().krpano.obj;
		if (krpano) {
			removeSunlightFromKrpano(krpano);
		}
	};
}

export function updateViewPort(id) {
    return (dispatch, getState) => {
        console.log(id)
		let sceneList = getState().scene.list;
		var krpano = getState().krpano.obj;
        console.log(sceneList)
		let sceneItem = sceneList.find((item) => item.id == id);
		console.log(sceneItem);
		console.log(krpano);
		if (sceneItem && krpano) {
			console.log("updateViewPort");
			krpano.set("view.hlookat", sceneItem.hlookat || 0);
			krpano.set("view.vlookat", sceneItem.vlookat || 0);
			krpano.set("view.fov", sceneItem.fov || 75);
		}
	};
}
