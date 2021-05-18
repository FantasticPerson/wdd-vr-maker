import React, { Component } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@material-ui/core";

import openFolder from "../../../native/openFolder";
import createPano from "../../../utils/createPano";
import { getScenePath, getTmpPreviewPath, getHeadImgUrl } from "../../../utils/pathUtils";
import copyImageToScene from "../../../native/copyImageToScene2";
import Hashid from "../../../utils/generateHashId";
import Timer from "../../../utils/timer";
import styles from "../../../styles/createSceneModal.module.css";

export default class CreateVrModal extends Component {
	constructor() {
		super();
		this.state = { tmpImgStatus: "ready", mutiInfos: [] };
		this.previewImg = getTmpPreviewPath();
		this.titleRef = React.createRef();
	}

	onCancelClick() {
		const { onCancel } = this.props.functions;
		onCancel();
	}

	onUploadMoreClick() {
		const { showAddScenes } = this.props.functions;
		showAddScenes();
	}

	componentDidMount() {
		const { originData } = this.props;
		setTimeout(() => {
			this.titleRef.value = originData.name;
		});
		this.previewImg = getHeadImgUrl(originData.id);
	}

	async onConfirmClick() {
		const { tmpImgStatus, mutiInfos } = this.state;
		const { originData } = this.props;

		const title = this.titleRef.value.trim();

		if (title.length > 0 && tmpImgStatus == "ready") {
			let sceneId = originData.id;
			const { onCancel, modifyScene } = this.props.functions;

			let err = await copyImageToScene(getScenePath(sceneId));
			let sceneItem = { ...originData, t2: new Date().valueOf(), name: title, mutiInfos: mutiInfos };
			if (!err) {
				modifyScene(sceneItem);
			}
			onCancel();
		}
	}

	async onOpenFileClick() {
		let res = await openFolder();
		if (Array.isArray(res) && res[0] && res[0].indexOf(".jpg") >= 0) {
			this.setState({ tmpImgStatus: "process" });
			let mutiInfos = await createPano(res[0]);
			await Timer(800);
			this.setState({ tmpImgStatus: "ready", mutiInfos: mutiInfos[0] });
			this.previewImg = getTmpPreviewPath();
		} else if (res != undefined && res != null) {
			alert("上传图片失败!请重试");
		}
	}

	renderUploadPic() {
		const { tmpImgStatus } = this.state;
		if (tmpImgStatus != "ready") {
			return <div className={styles.imgContainer}>{tmpImgStatus == "empty" ? "等待上传" : "处理图片中 请稍候..."}</div>;
		} else {
			return (
				<div className={styles.imgContainer}>
					<img className={styles.thumb} alt='' src={this.previewImg} />
				</div>
			);
		}
	}

	render() {
		return (
			<Dialog open={true}>
				<DialogTitle id='alert-dialog-title'>{"替换场景"}</DialogTitle>
				<DialogContent style={{ width: "500px" }}>
					<div style={{ display: "inline-block", width: "50%", height: "160px" }}>
						<TextField placeholder='Placeholder' margin='normal' inputRef={(input) => (this.titleRef = input)} />
						<br />
					</div>
					<div style={{ display: "inline-block", width: "50%", height: "260px", verticalAlign: "top" }}>
						<div style={{ textAlign: "right" }}>
							<Button variant='contained' color='primary' onClick={this.onOpenFileClick.bind(this)}>
								{"替换全景"}
							</Button>
						</div>
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
