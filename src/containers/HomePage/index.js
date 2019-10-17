import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as vrActions from "../../actions/vr";
import * as folderActions from "../../actions/folder";
import * as appActions from "../../actions/app";
import * as groupActions from "../../actions/group";
import * as pictureActions from "../../actions/picture";
import * as audioActions from "../../actions/audio";

import PictureContainer from "./PictureContainer";
import AudioContainer from "./AudioContainer";
import VrContainer from "./VrContainer";
import { getSelector } from "../../store/getStore";
import { APP_SHOW_TYPE_VR, APP_SHOW_TYPE_PIC, APP_SHOW_TYPE_AUDIO } from "../../actions/app";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showCreateFolderItem: false,
			showFolderMenu: false,
			posData: {},
			contextFolderData: {}
		};
	}

	componentDidMount() {
		this.props.updateFolderFromLocal();
		this.props.updateAppTitle("全景制作工具");
		this.props.updateAppShowBack(false);
		this.props.updatePictureFromLocal();
		this.props.updateAudioFromLocal();
	}

	render() {
		return (
			<div style={{ height: "100%", overflowY: "auto" }}>
				{this.renderVrContainer()}
				{this.renderPictureContainer()}
				{this.renderAudioContainer()}
			</div>
		);
	}

	renderVrContainer() {
		if (this.props.showType == APP_SHOW_TYPE_VR) {
			return <VrContainer></VrContainer>;
		}
	}

	renderPictureContainer() {
		if (this.props.showType == APP_SHOW_TYPE_PIC) {
			return <PictureContainer></PictureContainer>;
		}
	}

	renderAudioContainer() {
		if (this.props.showType == APP_SHOW_TYPE_AUDIO) {
			return <AudioContainer></AudioContainer>;
		}
	}
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(vrActions, dispatch),
		...bindActionCreators(folderActions, dispatch),
		...bindActionCreators(appActions, dispatch),
		...bindActionCreators(groupActions, dispatch),
		...bindActionCreators(pictureActions, dispatch),
		...bindActionCreators(audioActions, dispatch)
	};
}

export default connect(
	getSelector({
		vrList: true,
		folderList: true,
		folderSelectedId: true,
		appShowType: true
	}),
	mapDispatchToProps
)(Home);
