import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Timer from "../../utils/timer";

import { getSelector } from "../../store/getStore";

import styles from "../../styles/EditPage.module.css";

import PanoContainer from "./panoContainer";
import * as appActions from "../../actions/app";
import * as vrActions from "../../actions/vr";
import * as sceneActions from "../../actions/scene";
import * as folderActions from "../../actions/folder";
import * as hotpotActions from "../../actions/hotpot";
import * as PictureActions from "../../actions/picture";
import * as audioActions from "../../actions/audio";
import * as krpanoActions from "../../actions/krpano";
import * as groupActions from "../../actions/group";

import EditViewPort from "./edit/EditViewPort";
import EditHotSpot from "./edit/EditHotSpot";
import EditEffect from "./edit/EditEffect";
import EditMusic from "./edit/EditMusic";
import EditScene from "./editScene";

class EditPage extends Component {
	constructor() {
		super();
		this.state = { editType: 0 };
		this._mounted = false;
	}

	componentDidMount() {
		this._mounted = true;

		Timer(100).then(() => {
			if (this._mounted) {
				this.props.updateAppTitle("编辑全景");
				this.props.updatePictureFromLocal();
				this.props.updateAudioFromLocal();
				this.props.updateAppShowBack(true);
				this.props.updateGroupByVrid();
				setTimeout(() => {
					this.props.updateAllSceneFromLocal();
				}, 100);
			}
		});
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	showHotspotEdit() {
		this.setState({ editType: 1 });
	}

	onEditClick(type) {
		this.setState({ editType: type });
		if (type != 1) {
			this.props.updateHotspotSelect(null);
		}
	}

	render() {
		return (
			<div className={styles.container}>
				{this.renderLeftBtns()}
				<div className={styles.content}>
					<div className={styles.panoContainer}>
						<PanoContainer showEditHotpot={this.showHotspotEdit.bind(this)}></PanoContainer>
					</div>
					<div className={styles.sceneContainer}>
						<EditScene></EditScene>
					</div>
				</div>
				<div className={styles.rightBar}>
					{this.renderEditHotPot()}
					{this.renderEditSpecialShow()}
					{this.renderEditMusic()}
					{this.renderEditViewPort()}
				</div>
			</div>
		);
	}

	renderEditViewPort() {
		if (this.state.editType == 0) {
			return <EditViewPort onfinish={this.showHotspotEdit.bind(this)}></EditViewPort>;
		}
	}

	renderEditHotPot() {
		if (this.state.editType == 1) {
			return <EditHotSpot></EditHotSpot>;
		}
	}

	renderEditMusic() {
		if (this.state.editType == 2) {
			return <EditMusic onfinish={this.showHotspotEdit.bind(this)}></EditMusic>;
		}
	}

	renderEditSpecialShow() {
		if (this.state.editType == 3) {
			return <EditEffect onfinish={this.showHotspotEdit.bind(this)}></EditEffect>;
		}
	}

	renderLeftBtns() {
		let btnProps = [{ class: "fa fa-eye", name: "视角" }, { class: "fa fa-dot-circle-o", name: "热点" }, { class: "fa fa-music", name: "音乐" }, { class: "fa fa-magic", name: "特效" }];
		return (
			<div className={styles.leftBar}>
				{btnProps.map((item, index) => {
					let btnClassName = this.state.editType == index ? `${styles.btn} ${styles.btnSelected}` : `${styles.btn}`;
					return (
						<div
							key={item.class}
							className={btnClassName}
							onClick={() => {
								this.onEditClick(index);
							}}
						>
							<i className={item.class}></i>
							<p>{item.name}</p>
						</div>
					);
				})}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(appActions, dispatch),
		...bindActionCreators(sceneActions, dispatch),
		...bindActionCreators(vrActions, dispatch),
		...bindActionCreators(folderActions, dispatch),
		...bindActionCreators(hotpotActions, dispatch),
		...bindActionCreators(PictureActions, dispatch),
		...bindActionCreators(audioActions, dispatch),
		...bindActionCreators(krpanoActions, dispatch),
		...bindActionCreators(groupActions, dispatch)
	};
}

export default connect(
	getSelector({ vrList: true, vrId: true }),
	mapDispatchToProps
)(EditPage);
