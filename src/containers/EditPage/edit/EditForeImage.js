import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TextField, Checkbox, Button as FlatButton, FormControlLabel } from "@material-ui/core";

import UploadPicModal from "./components/UploadPicModal";
import CopyImageTmpToImage from "../../../native/copyImageTmpToImage";
import getPathOfImage from "../../../native/getPathOfImage";

import { getSelector } from "../../../store/getStore";

class EditForeImage extends Component {
	constructor() {
		super();
		this.state = { foreImagePC: null, foreImageMobile: null };
	}

	componentDidMount() {
		const { vrItem } = this.props;
		if (vrItem) {
			this.setState({ foreImagePC: vrItem.foreImagePC, foreImageMobile: vrItem.foreImageMobile, showUploadModal1: false, showUploadModal2: false });
		}
	}

	onRemoveClick(type) {
		if (type == 0) {
			this.setState({ foreImagePC: null });
		} else {
			this.setState({ foreImageMobile: null });
		}
	}

	onUploadConfirm(path, showName) {
		const { showUploadModal1, showUploadModal2 } = this.state;
		let type = showUploadModal1 ? 0 : 1;
		CopyImageTmpToImage(path).then(() => {
			const { addPicture } = this.props;
			let arr = path.split(".");
			let picItem = {
				id: arr[0],
				extension: arr[1],
				showName: showName,
			};
			addPicture(picItem);
			setTimeout(() => {
				// const { list } = this.state;
				var name = `${arr[0]}.${arr[1]}`;
				// let sameImg = list.find((item) => item.name == name);
				// if (!sameImg) {
				if (type == 0) {
					this.setState({ foreImagePC: { name: name, showName: showName } });
				} else {
					this.setState({ foreImageMobile: { name: name, showName: showName } });
				}
				// list.push({ name: name, showName: showName });
				// 	this.setState({ list: list });
				// }
			}, 300);
		});
		this.hideUploadPic();
	}

	hideUploadPic() {
		this.setState({ showUploadModal1: false, showUploadModal2: false });
	}

	showUpload(type) {
		if (type == 0) {
			this.setState({ showUploadModal1: true });
		} else {
			this.setState({ showUploadModal2: true });
		}
	}

	renderImage(type) {
		const { foreImageMobile, foreImagePC } = this.state;
		const imgPath = type == 0 ? foreImagePC : foreImageMobile;
		if (imgPath) {
			let picItemStyle = {
				height: "75px",
				width: "75px",
				display: "inline-block",
				overflow: "hidden",
				position: "relative",
				border: "1px solid #ccc",
				borderRadius: "5px",
				marginTop: 10,
			};
			return (
				<div style={picItemStyle}>
					<i onClick={() => this.onRemoveClick(type)} className='fa fa-times pictureCloseBtn' aria-hidden='true'></i>
					<img style={{ width: "100%" }} src={getPathOfImage(false, imgPath.name)} />
				</div>
			);
		}
	}

	renderUploadModal() {
		const { showUploadModal1, showUploadModal2 } = this.state;
		if (showUploadModal1 || showUploadModal2) {
			return <UploadPicModal onCancel={this.hideUploadPic.bind(this)} onConfirm={this.onUploadConfirm.bind(this)}></UploadPicModal>;
		}
	}

	onSelectConfirm() {
		const { foreImageMobile, foreImagePC } = this.state;
		const { updateVrForeImage, vrItem } = this.props;
		updateVrForeImage(vrItem.id, { foreImageMobile, foreImagePC });
	}

	render() {
		let titleStyle = {
			marginBottom: 10,
			paddingBottom: 10,
		};
		let conStyle = {
			border: "2px solid #eee",
			padding: 5,
			marginBottom: 10,
			borderRadius: 5,
		};
		let chooseStyle = {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginTop: 10,
		};
		return (
			<div style={{ padding: "5px" }}>
				<div style={{ borderBottom: "1px solid #eee", ...titleStyle }}>
					<span>
						<i className='fa fa-music'></i>
						<span style={{ marginLeft: "5px" }}>首页</span>
					</span>
				</div>
				<div style={conStyle}>
					<div style={{ marginTop: "10px", borderBottom: "1px solid #eee", ...titleStyle, marginTop: 10 }}>首页图片设置</div>
					<div style={chooseStyle}>
						<span style={{ width: 100 }}>选择图片(PC)</span>
						<FlatButton color='primary' onClick={() => this.showUpload(0)}>
							本地添加
						</FlatButton>
					</div>
					{this.renderImage(0)}
					<div style={chooseStyle}>
						<span style={{ width: 100 }}>选择图片(MOBILE)</span>
						<FlatButton color='primary' onClick={() => this.showUpload(1)}>
							本地添加
						</FlatButton>
					</div>
					{this.renderImage(1)}
				</div>
				<FlatButton variant='contained' color='primary' onClick={this.onSelectConfirm.bind(this)} color='primary' style={{ marginLeft: "155px" }}>
					确定
				</FlatButton>
				{this.renderUploadModal()}
			</div>
		);
	}
}

export default connect(getSelector({ vrItem: true }), null)(EditForeImage);
