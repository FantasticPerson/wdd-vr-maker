import React, { Component } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@material-ui/core";

import styles from "../../../styles/createSceneModal.module.css";
import openImage from "../../../native/openImage";
import CopyImageToImageTmp from "../../../native/copyImageToImageTmp";
import getPathOfImage from "../../../native/getPathOfImage";

class UploadPicModal extends Component {
    constructor() {
        super();
        this.state = { tmpImgReady: false, previewImg: null, imageName: null, showName: "", isTemp: false };
        this.nameRef = React.createRef();
    }
    renderUploadPic() {
        const { imageName, isTemp } = this.state;
        if (!imageName) {
            return <div className={styles.imgContainer}>等待上传</div>;
        } else {
            let imgUrl = getPathOfImage(isTemp, imageName);
            return (
                <div className={styles.imgContainer}>
                    <img className={styles.thumb} alt='' src={imgUrl} />
                </div>
            );
        }
    }

    componentDidMount() {
        const { itemData } = this.props;
        this.setState({
            showName: itemData.showName,
            imageName: itemData.id + "." + itemData.extension,
            isTemp: false,
        });
        setTimeout(() => {
            this.nameRef.value = itemData.showName;
        }, 500);
    }

    onUploadClick() {
        openImage()
            .then((res) => {
                if (res && res[0]) {
                    let path = res[0];
                    return CopyImageToImageTmp(path);
                }
            })
            .then((name) => {
                setTimeout(() => {
                    if(name){
                        this.setState({ imageName: name, isTemp: true });
                    }
                }, 300);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onConfirmClick() {
        const { imageName } = this.state;
        const { onConfirm } = this.props;
        let showName = this.nameRef.value.trim();
        if (!showName) {
            alert("请输入名称");
            return;
        }
        if (!imageName) {
            alert("请上传图片");
            return;
        } else {
            onConfirm(imageName, showName);
        }
    }

    render() {
        const { onCancel } = this.props;
        return (
            <Dialog
                open
                onClose={() => {
                    onCancel();
                }}>
                <DialogTitle id='alert-dialog-title'>{"替换图片"}</DialogTitle>
                <DialogContent style={{ width: "500px" }}>
                    <div style={{ display: "inline-block", width: "100%", height: "260px", verticalAlign: "top" }}>
                        <Button style={{ marginLeft: "47px" }} color='primary' onClick={this.onUploadClick.bind(this)}>
                            替换图片
                        </Button>
                        {this.renderUploadPic()}
                        <TextField
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
                        />
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
