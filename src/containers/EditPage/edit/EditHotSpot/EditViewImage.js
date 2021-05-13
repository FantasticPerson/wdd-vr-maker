import React, { Component } from "react";
import { TextField, Button as FlatButton, Checkbox, FormControlLabel, Select, MenuItem } from "@material-ui/core";

import UploadPicModal from "../components/UploadPicsModal";
import CopyImageTmpToImage, { copyImage2TmpToImage } from "../../../../native/copyImageTmpToImage";
import PicListModal from "../components/PicListModal";
import getPathOfImage from "../../../../native/getPathOfImage";
import Hashid from "../../../../utils/generateHashId";

export default class EditViewImage extends Component {
	constructor() {
		super();
		this.titleRef = React.createRef();
		this.moreInfo = React.createRef();
		this.summaryRef = React.createRef();
		this.state = {
			list: [],
			showUploadModal: false,
			showPicListModal: false,
			pickedPic: null,
			check: true,
			openInNewWindow: false,
			mediaId: `viewImage_media_${new Hashid().encode()}`,
		};
	}

	componentWillMount() {
		const { action } = this.props;
		if (action.length > 0) {
			let obj = JSON.parse(action);
			if (obj.type == "viewImage") {
				this.setState({
					list: obj.picArr,
					check: obj.check,
					defaultTitle: obj.title,
					defaultSummary: obj.summary,
					openInNewWindow: obj.openInNewWindow,
					defaultMoreInfo: obj.moreInfo,
					mediaId: obj.mediaId,
				});
			}
		}
	}

	getResult() {
		const { pickedPic, list, check, openInNewWindow, mediaId } = this.state;
		// let item2 = list.find((obj, index) => {
		//     return obj.name == pickedPic.name;
		// });
		// if (item2) {
		//     item2.text = this.summaryRef.value.trim();
		//     this.setState({ list: list });
		// }

		let title = this.titleRef.value.trim();
		let moreInfo = this.moreInfo.value.trim();
		let summary = this.summaryRef.value.trim();
		if (title.length == 0) {
			alert("请填写标题");
			return false;
		}
		if (summary.length == 0) {
			alert("文字介绍不能为空");
			return false;
		}

		if (list.length == 0) {
			alert("请选择图片");
			return false;
		}
		return JSON.stringify({ type: "viewImage", mediaId: mediaId, title: title, picArr: list, moreInfo, openInNewWindow, summary, size: list.length, ext: list[0].name.split(".").pop() });
	}

	onRemoveClick(item) {
		// const { list } = this.state;
		// let index = list.indexOf(item);
		this.setState({ list: [] });
		// if (index >= 0) {
		// list.splice(index, 1);
		// this.setState({ list: list });
		// }
	}

	updateCheck() {
		this.setState({ check: !this.state.check });
	}

	updateCheckNew() {
		this.setState({ openInNewWindow: !this.state.openInNewWindow });
	}

	handleSelectChange(event) {
		let value = event.target.value;
		this.setState({ playType: value });
	}

	render() {
		const { list, defaultTitle, defaultMoreInfo, defaultSummary, defaultContent, defaultZs } = this.state;
		const { pickedPic } = this.state;
		let sceneItemStyle = { height: "75px", width: "75px", position: "relative", cursor: "pointer", border: "1px solid #ccc", borderRadius: "5px" };
		let titleStyle = {
			height: 25,
			lineHeight: "25px",
			overflow: "hidden",
			textOverflow: "ellipse",
			whiteSpace: "nowrap",
		};
		let picArr = "";
		let item = list[0];
		if (item) {
			let styleObj = sceneItemStyle;
			picArr = (
				<div style={{ display: "inline-block", margin: 5 }} key={item.name}>
					<div style={styleObj} key={item.name}>
						<i onClick={() => this.onRemoveClick(item)} className='fa fa-times pictureCloseBtn' aria-hidden='true'></i>
						<img style={{ width: "100%" }} src={getPathOfImage(false, item.name)} />
						<div>{list.length}帧</div>
					</div>
					{/* <div style={titleStyle} title={item.showName}>
                        {item.showName}
                    </div> */}
				</div>
			);
		}

		return (
			<div>
                <FormControlLabel control={<Checkbox checked={this.state.check} onChange={this.updateCheck.bind(this)} value='在新窗口中打开' color='primary' />} label='在全景中显示' />
				<div>
					<div>
						{/* <FlatButton style={{ display: "inline-block" }} variant='contained' color='primary' onClick={() => this.setState({ showPicListModal: true })}>
                            {"图片库添加"}
                        </FlatButton> */}
						<FlatButton variant='contained' color='primary' onClick={() => this.setState({ showUploadModal: true })}>
							{"添加图片"}
						</FlatButton>
					</div>
					<div style={{ color: "#aaa" }}>(每张图片不超过600kB,使用从1开始的连续数字命名,数字前面再加一个统一的前缀 xx- 这种形式的, 最多支持上传72张, 如: 1.jpg, 2.jpg, ...24.jpg)</div>
				</div>
				<div style={{ width: "180px", margin: "0 auto", marginTop: 15, display: "flex", flexWrap: "wrap" }}>{picArr}</div>
				<TextField id='with-placeholder' label='标题' placeholder='请输入标题' defaultValue={defaultTitle} margin='normal' inputRef={(input) => (this.titleRef = input)} />
				<TextField id='with-placeholder' placeholder='请输入文字介绍' label='文字介绍' defaultValue={defaultSummary} margin='normal' inputRef={(input) => (this.summaryRef = input)}></TextField>
				<TextField id='with-placeholder' label='填写网址，展示更多内容' placeholder='更多内容' margin='normal' defaultValue={defaultMoreInfo} inputRef={(input) => (this.moreInfo = input)} />
				<FormControlLabel control={<Checkbox checked={this.state.openInNewWindow} onChange={this.updateCheckNew.bind(this)} value='在新窗口中打开' color='primary' />} label='在新窗口中打开' />
				{this.renderPicListModal()}
				{this.renderUploadModal()}
			</div>
		);
	}

	hideUploadPic() {
		this.setState({ showUploadModal: false });
	}

	async onUploadConfirm(images, showName) {
		const { addPicture } = this.props;
		let result = [];
		for (let i = 0; i < images.length; i++) {
			let item = images[i];
			await copyImage2TmpToImage(item.imageName);
			let arr = item.imageName.split(".");
			let picItem = {
				id: arr[0],
				extension: arr[1],
				showName: item.showName,
			};
			addPicture(picItem);
			result.push({ name: item.imageName, showName: item.showName });
			setTimeout(() => {
				this.setState({ list: result });
			}, 300);
		}
		// CopyImageTmpToImage(path).then(() => {
		//     const { addPicture } = this.props;
		//     let arr = path.split(".");
		//     let picItem = {
		//         id: arr[0],
		//         extension: arr[1],
		//         showName: showName,
		//     };
		//     addPicture(picItem);
		//     setTimeout(() => {
		//         const { list } = this.state;
		//         var name = `${arr[0]}.${arr[1]}`;
		//         let sameImg = list.find((item) => item.name == name);
		//         if (!sameImg) {
		//             list.push({ name: name, showName: showName });
		//             this.setState({ list: list });
		//         }
		//     }, 300);
		// });
		this.hideUploadPic();
	}

	renderUploadModal() {
		if (this.state.showUploadModal) {
			return <UploadPicModal onCancel={this.hideUploadPic.bind(this)} onConfirm={this.onUploadConfirm.bind(this)}></UploadPicModal>;
		}
	}

	onLocalPicListCancel() {
		this.setState({ showPicListModal: false });
	}

	checkImgName(arr) {
		let nameArr = arr.map((item) => {
			let name = item.showName.split("-");
			name = name[name.length - 1];
			return { ...item, rName: Number(name) };
		});
		for (let i = 0; i < nameArr; i++) {
			if (isNaN(nameArr[i].rName)) {
				alert("文件命名不规范");
				return false;
			}
		}
		nameArr.sort((item1, item2) => item1.rName - item2.rName);
		for (let i = 0; i < nameArr.length; i++) {
			if (nameArr[i].rName != i + 1) {
				alert("文件命名不规范");
				return false;
			}
		}
		return nameArr;
	}

	onLocalPicListConfirm(arr) {
		// let list = this.state.list;
		// let res = this.checkImgName(arr);
		if (!arr) return;
		if (arr.length > 0) {
			// for (let i = 0; i < arr.length; i++) {
			//     if (!list.find((item) => item.name == arr[i].name)) {
			//         list.push(arr[i]);
			//     }
			// }
			this.setState({ list: arr });
		}
		this.onLocalPicListCancel();
	}

	renderPicListModal() {
		if (this.state.showPicListModal) {
			return <PicListModal onCancel={this.onLocalPicListCancel.bind(this)} onConfirm={this.onLocalPicListConfirm.bind(this)}></PicListModal>;
		}
	}
}
