import React, { Component } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@material-ui/core";

import styles from "../../../../styles/createSceneModal.module.css";
import openImage from "../../../../native/openImages";
import CopyImageToImageTmp, { clearTmpPath, copyImgToTmp } from "../../../../native/copyImageToImageTmp";
import getPathOfImage from "../../../../native/getPathOfImage";

class UploadPicModal extends Component {
    constructor() {
        super();
        this.state = { tmpImgReady: false, previewImg: null, imageName: null, showName: [], images: null };
        this.nameRef = React.createRef();
    }
    renderUploadPic() {
        const { images } = this.state;
        if (!images || images.length == 0) {
            // return <div className={styles.imgContainer}>等待上传</div>;
        } else {
            // let imgUrl = getPathOfImage(true, imageName);
            return (
                <div className={styles.imgContainer2}>
                    {images.map((item) => {
                        let imgUrl = getPathOfImage(true, item.imageName);
                        return (
                            <div className={styles.thumbContainer}>
                                <div className={styles.thumb2} style={{ backgroundImage: "url(" + imgUrl + ")" }} />
                                <div className={styles.thumbTilte}>{item.cName}</div>
                            </div>
                        );
                    })}
                </div>
            );
        }
    }

    async onUploadClick() {
        let res = await openImage();
        if (res && res.length > 0) {
            let result = res.map((item) => {
                let splits = item.split("\\");
                let fName = splits[splits.length - 1];
                let showName = fName.split(".")[0];
                let cName = showName.split("-");
                cName = cName[cName.length - 1];
                return {
                    path: item,
                    showName: showName,
                    cName: Number(cName),
                };
            });
            let afix = result[0].path.split(".").pop();

            for (let i = 0; i < result.length; i++) {
                if (isNaN(result[i].cName)) {
                    alert("文件命名不规范");
                    return false;
                }
                if (result[i].path.split(".").pop() != afix) {
                    alert("文件命名不规范");
                    return false;
                }
            }
            result.sort((item1, item2) => item1.cName - item2.cName);
            for (let i = 0; i < result.length; i++) {
                if (result[i].cName != i + 1) {
                    alert("文件命名不规范");
                    return false;
                }
            }
            await clearTmpPath();
            for (let i = 0; i < result.length; i++) {
                let fPath = await copyImgToTmp(result[i].path);
                result[i].imageName = fPath;
            }
            setTimeout(() => {
                this.setState({ images: result });
            }, 300);
        }
    }

    onConfirmClick() {
        const { imageName, images } = this.state;
        const { onConfirm, onCancel } = this.props;
        // let showName = this.nameRef.value.trim();
        // if (!showName) {
        //     alert("请输入名称");
        //     return;
        // }
        if (!images || images.length == 0) {
            alert("请上传图片");
            return;
        } else {
            onConfirm(images);
        }
    }

    render() {
        const { onConfirm, onCancel } = this.props;
        return (
            <Dialog
                fullScreen
                open
                onClose={() => {
                    onCancel();
                }}>
                <DialogTitle id='alert-dialog-title'>{"添加图片"}</DialogTitle>
                <DialogContent>
                    <div style={{ display: "inline-block", width: "100%", verticalAlign: "top" }}>
                        <Button style={{ marginLeft: "47px" }} color='primary' onClick={this.onUploadClick.bind(this)}>
                            添加图片
                        </Button>
                        {this.renderUploadPic()}
                        {/* <TextField
                            id='with-placeholder'
                            label='请输入图片名称'
                            placeholder='名称'
                            margin='normal'
                            inputRef={(input) => (this.nameRef = input)}
                            style={{
                                position: "absolute",
                                left: 280,
                                top: 258,
                            }}
                        /> */}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            onCancel();
                        }}>
                        取消
                    </Button>
                    <Button onClick={this.onConfirmClick.bind(this)}>确认</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default UploadPicModal;
