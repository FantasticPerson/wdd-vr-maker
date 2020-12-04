export default class Group {}

Group.store = null;

Group.findAll = () => Group.store.toArray();
Group.findByVrid = (id) => Group.store.where("vrId").equals(id).toArray();
Group.add = (obj) => Group.store.put({ ...obj, timestamp: new Date().valueOf() });
Group.delete = (id) => Group.store.delete(id);
Group.updateAllGroup = (arr) => {
    return Promise.all(arr.map((obj) => Group.updateSort(obj)));
};
Group.updateSort = (obj) => {
    return Group.store
        .where("id")
        .equals(obj.id)
        .modify({
            ...obj,
            title: obj.title,
            folderId: obj.folderId,
            vrId: obj.vrId,
            music1: obj.music1,
            music2: obj.music2,
            sceneListIds: obj.sceneListIds,
        });
};
Group.update = (obj) => {
    return Group.store.where("id").equals(obj.id).modify({
        ...obj,
        title: obj.title,
        folderId: obj.folderId,
        vrId: obj.vrId,
        music1: obj.music1,
        music2: obj.music2,
        sceneListIds: obj.sceneListIds,
    });
};
