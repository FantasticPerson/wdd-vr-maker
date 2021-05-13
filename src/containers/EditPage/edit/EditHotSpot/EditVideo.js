import React, { Component } from "react";
import { Checkbox, TextField, Button as FlatButton, FormControlLabel } from "@material-ui/core";
import UploadVideoModal from "../components/UploadVideoModal";
import CopyVideoTmpToVideo from "../../../../native/copyVideoTmpToVideo";

export default class EditVideo extends Component {
	constructor() {
		super();
		this.titleRef = React.createRef();
		this.summaryRef = React.createRef();
		this.moreInfo = React.createRef();

		this.state = { check: true, openInNewWindow: true, showUploadModal: false, videoItem: null };
	}

	componentWillMount() {
		const { action } = this.props;
		if (action.length > 0) {
			let obj = JSON.parse(action);
			if (obj.type == "video") {
				this.setState({
					check: obj.check,
					openInNewWindow: obj.openInNewWindow,
					videoItem: obj.videoItem,
					defaultTitle: obj.title,
					defaultSummary: obj.url,
					defaultMoreInfo: obj.moreInfo,
				});
				if (obj.videoItem) {
					setTimeout(() => {
						this.summaryRef.value = obj.videoItem.showName;
					}, 100);
				}
			}
		}
	}

	getResult() {
		let title = this.titleRef.value.trim();
		let content = this.summaryRef.value.trim();
		let moreInfo = this.moreInfo.value.trim();

		const { check, openInNewWindow, videoItem } = this.state;
		if (!videoItem) {
			alert("请添加视频");
			return;
		}
		if (title.length == 0) {
			alert("请输入标题");
			return false;
		}

		if (content.length == 0) {
			alert("请输入视频地址");
			return false;
		}
		return JSON.stringify({ type: "video", videoItem: videoItem, title: title, url: content, moreInfo, check, openInNewWindow });
	}

	updateCheck() {
		this.setState({ check: !this.state.check });
	}

	updateCheckNew() {
		this.setState({ openInNewWindow: !this.state.openInNewWindow });
	}

	hideUploadVideo() {
		this.setState({ showUploadModal: false });
	}

	deleteVideo() {
		this.setState({ videoItem: null });
		this.summaryRef.value = "";
	}

	onUploadConfirm(path, showName) {
		CopyVideoTmpToVideo(path).then(() => {
			const { addVideo } = this.props;
			let arr = path.split(".");
			let videoItem = {
				id: arr[0],
				extension: arr[1],
				showName: showName,
			};
			addVideo(videoItem);
			setTimeout(() => {
				// const { list } = this.state;
				var name = `${arr[0]}.${arr[1]}`;
				this.setState({ videoItem: { name: name, showName: showName } });
				this.summaryRef.value = showName;
				// let sameImg = list.find((item) => item.name == name);
				// if (!sameImg) {
				// 	list.push({ name: name, showName: showName });
				// 	this.setState({ list: list });
				// }
			}, 300);
		});
		this.hideUploadVideo();
	}

	renderUploadModal() {
		if (this.state.showUploadModal) {
			return <UploadVideoModal onCancel={this.hideUploadVideo.bind(this)} onConfirm={this.onUploadConfirm.bind(this)}></UploadVideoModal>;
		}
	}

	render() {
		const { defaultTitle, defaultSummary, defaultMoreInfo, videoItem } = this.state;

		return (
			<div>
				<FormControlLabel control={<Checkbox checked={this.state.check} onChange={this.updateCheck.bind(this)} value='在新窗口中打开' color='primary' />} label='在全景中显示' />

				<TextField id='with-placeholder' label='请输入标题' placeholder='标题' margin='normal' defaultValue={defaultTitle} inputRef={(input) => (this.titleRef = input)} />

				<br />

				<TextField id='with-placeholder' label='请输入视频地址' placeholder='视频地址' margin='normal' inputRef={(input) => (this.summaryRef = input)} />
				<FlatButton color='primary' variant='contained' style={{ display: "inline-block", float: "right" }} onClick={() => this.setState({ showUploadModal: true })}>
					{"添加视频"}
				</FlatButton>
				{videoItem ? (
					<FlatButton color='secondary' variant='contained' style={{ display: "inline-block", float: "right" }} onClick={() => this.deleteVideo()}>
						{"删除视频"}
					</FlatButton>
				) : null}

				<FormControlLabel control={<Checkbox checked={this.state.openInNewWindow} onChange={this.updateCheckNew.bind(this)} value='在新窗口中打开' color='primary' />} label='在新窗口中打开' />

				<TextField id='with-placeholder' label='填写网址 展示更多内容' placeholder='更多内容' margin='normal' defaultValue={defaultMoreInfo} inputRef={(input) => (this.moreInfo = input)} />
				{this.renderUploadModal()}
			</div>
		);
	}
}
