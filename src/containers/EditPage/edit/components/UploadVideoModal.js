import React, { Component } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@material-ui/core";

import styles from "../../../../styles/createSceneModal.module.css";
import openVideo from "../../../../native/openVideo";
import CopyVideoToVideoTmp from "../../../../native/copyVideoToVideoTmp";
import getPathOfVideo from "../../../../native/getPathOfVideo";

class UploadPicModal extends Component {
	constructor() {
		super();
		this.state = { tmpImgReady: false, previewImg: null, videoName: null, showName: "" };
		this.nameRef = React.createRef();
	}
	renderUploadPic() {
		const { videoName } = this.state;
		if (!videoName) {
			return <div className={styles.imgContainer}>等待上传</div>;
		} else {
			let imgUrl = getPathOfVideo(true, videoName);
			return (
				<div className={styles.imgContainer}>
					<video className={styles.thumb} src={imgUrl} />
				</div>
			);
		}
	}

	onUploadClick() {
		openVideo()
			.then((res) => {
				if (res && res[0]) {
					let path = res[0];
					return CopyVideoToVideoTmp(path);
				}
			})
			.then((name) => {
				setTimeout(() => {
					this.setState({ videoName: name });
				}, 300);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	onConfirmClick() {
		const { videoName } = this.state;
		const { onConfirm, onCancel } = this.props;
		let showName = this.nameRef.value.trim();
		if (!showName) {
			alert("请输入名称");
			return;
		}
		if (!videoName) {
			alert("请上传视频");
			return;
		} else {
			onConfirm(videoName, showName);
		}
	}

	render() {
		const { onConfirm, onCancel } = this.props;
		return (
			<Dialog
				open
				onClose={() => {
					onCancel();
				}}>
				<DialogTitle id='alert-dialog-title'>{"添加图片"}</DialogTitle>
				<DialogContent style={{ width: "500px" }}>
					<div style={{ display: "inline-block", width: "100%", height: "260px", verticalAlign: "top" }}>
						<Button style={{ marginLeft: "47px" }} color='primary' onClick={this.onUploadClick.bind(this)}>
							添加视频
						</Button>
						{this.renderUploadPic()}
						<TextField
							id='with-placeholder'
							label='请输入视频名称'
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
