import React, { Component } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@material-ui/core";

import openFolder from "../../../native/openFolder";
import Hashid from "../../../utils/generateHashId";
import checkVrCoverValid from "../../../utils/checkVrCoverValid";
import { copyImagaToTmpImage, copyImageTmpToImage } from "../../../utils/copyUtil";
import { getTmpImagePath, getImagePath } from "../../../utils/pathUtils";
import styles from "../../../styles/CreateVrModal.module.css";

export default class CreateVrModal extends Component {
    constructor() {
        super();
        this.state = { tmpImgStatus: false, imgName: null };

        this.titleRef = React.createRef();
        this.summaryRef = React.createRef();
    }

    onCancelClick() {
        this.props.functions.onCancel();
    }

    async onConfirmClick() {
        const { data } = this.props;
        const { imgName } = this.state;
        const { addVr, onCancel, addGroup, addPicture, modifyVr } = this.props.functions;
        const title = this.titleRef.value.trim();
        const brief = this.summaryRef.value.trim();

        let previewImg = null;

        if (title.length === 0) {
            alert("标题不能为空");
            return;
        }
        if (imgName) {
            let arr = imgName.split(".");
            let picItem = { id: arr[0], extension: arr[1] };
            previewImg = imgName;
            await copyImageTmpToImage(imgName);
            addPicture(picItem);
        }
        if (data) {
            previewImg = previewImg ? previewImg : data.headImg;
            modifyVr({ ...data, title: title, brief: brief, headImg: previewImg });
        } else {
            let id = `vr_${new Hashid().encode()}`;
            let groupId = `group_${new Hashid().encode()}`;

            addGroup("默认", id, groupId);
            addVr({ title, brief, headImgId: previewImg, music1: null, music2: null, id });
        }
        onCancel();
    }

    async addPoster() {
        let res = await openFolder(["openFile"], [{ name: "Images", extensions: ["jpg", "png", "gif"] }]);
        if (res && res[0]) {
            let path = await checkVrCoverValid(res[0]);
            console.log(copyImagaToTmpImage);
            let name = await copyImagaToTmpImage(path);
            this.setState({ tmpImgStatus: true, imgName: name });
        }
    }

    renderUploadPic() {
        const { tmpImgStatus, imgName } = this.state;
        const { data } = this.props;
        if (!tmpImgStatus && (!data || !data.headImg)) {
            return (
                <div className={styles.imgContainer}>
                    <br />
                    <br />
                    <span>{"上传封面"}</span>
                    <br />
                    <span>{"大小:512*512"}</span>
                </div>
            );
        } else {
            let imgPath = imgName ? getTmpImagePath(imgName) : data.headImg ? getImagePath(data.headImg) : "";
            return (
                <div className={styles.imgContainer}>
                    <img className={styles.thumb} src={imgPath} alt='' />
                </div>
            );
        }
    }

    render() {
        const { data } = this.props;
        let title = data ? "编辑作品" : "创建作品";
        let defaultName = data ? data.title : "";
        let defaultBrief = data ? data.brief : "";

        return (
            <Dialog open>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent style={{ width: "500px" }}>
                    <div style={{ display: "inline-block", width: "50%", height: "160px" }}>
                        <TextField label='作品名称' placeholder='请输入作品名称' margin='normal' inputRef={(input) => (this.titleRef = input)} defaultValue={defaultName} />
                        <br />
                        <TextField label='入作品简介' placeholder='请输入作品简介' margin='normal' inputRef={(input) => (this.summaryRef = input)} defaultValue={defaultBrief} multiline rows={2} rowsMax={4} />
                    </div>
                    <div style={{ display: "inline-block", width: "50%", height: "260px", verticalAlign: "top" }}>
                        <Button color='primary' style={{ marginLeft: "47px" }} onClick={this.addPoster.bind(this)}>
                            添加封面
                        </Button>
                        {this.renderUploadPic()}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancelClick.bind(this)}>取消</Button>
                    <Button onClick={this.onConfirmClick.bind(this)}>确认</Button>
                </DialogActions>
            </Dialog>
        );
    }
}
