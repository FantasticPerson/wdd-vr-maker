export default class Scene {}

Scene.store = null;

Scene.findAll = () => Scene.store.toArray();
Scene.findAllSceneById = id => {
	return Scene.store
		.where("vrid")
		.equals(id)
		.toArray();
};
Scene.findAllSceneByGroupId = id => {
	return Scene.store
		.where("groupId")
		.equals(id)
		.toArray();
};
Scene.add = obj =>
	Scene.findAllSceneByGroupId(obj.groupId).then(list => {
		let index = list.length;
		return Scene.store.put({
			index: index,
			...obj,
			timestamp: new Date().valueOf()
		});
	});

Scene.update = obj => Scene.add(obj);
Scene.delete = id => Scene.store.delete(id);
Scene.updateAllScene = arr => Promise.all(arr.map(obj => Scene.add(obj)));
