import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createHashHistory } from "history";
import FlatButton from "@material-ui/core/Button";

import { getSelector } from "../../../store/getStore";
import * as vrActions from "../../../actions/vr";
import * as sceneActions from "../../../actions/scene";
import * as groupActions from "../../../actions/group";
import CreateVrModal from "./CreateVrModal";
import VrItem from "./VrItem";
import VrContextMenu from "./VrContextMenu";

import styles from "../../../styles/VrContainer.module.css";

class VrContainer extends Component {
	constructor() {
		super();
		this.history = createHashHistory();
		this.state = {
			showCreateVrModal: false,
			showVrContextMenu: false,
			vrContextItem: null,
			contextPosData: {}
		};
	}

	onAddClick() {
		this.setState({ showCreateVrModal: true, vrContextItem: null });
	}

	onCancelClick() {
		this.setState({ showCreateVrModal: false, vrContextItem: null });
	}

	onVrItemContext(e, data) {
		e.preventDefault();
		this.setState({
			showVrContextMenu: true,
			vrContextItem: data,
			contextPosData: { posX: e.clientX, posY: e.clientY }
		});
    }
    
	hideVrContext() {
		this.setState({ showVrContextMenu: false });
	}

	onModify() {
		this.setState({ showCreateVrModal: true });
	}

	renderContent() {
		const { vrList } = this.props;
		if (vrList.length > 0) {
			let vrItems = vrList
				.map((item, index) => {
					return <VrItem key={index} onContextMenu={this.onVrItemContext.bind(this)} history={this.history} data={item}></VrItem>;
				})
				.concat(
					new Array(20).fill(0).map((item, index) => {
						return <div key={`placeHolder${item + "" + index}`} style={{ width: "230px", height: "0" }}></div>;
					})
				);
			return <div className={styles.content}>{vrItems}</div>;
		} else {
			return (
				<div className={styles.content}>
					<h3>{`暂无内容，点击左上角按钮进行添加！`}</h3>
				</div>
			);
		}
	}

	renderCreateVrModal() {
		if (this.state.showCreateVrModal) {
			const { vrContextItem } = this.state;
			const { addScene, addVr, modifyVr, addGroup, addPicture } = this.props;
			const functions = {
				addScene,
				addVr,
				modifyVr,
				addGroup,
				addPicture,
				onCancel: this.onCancelClick.bind(this)
			};
			return <CreateVrModal data={vrContextItem} functions={functions}></CreateVrModal>;
		}
	}

	renderVrContextMenu() {
		if (this.state.showVrContextMenu) {
			const { contextPosData, vrContextItem } = this.state;
			const { delVr } = this.props;
			const functions = {
				delVr,
				onModify: this.onModify.bind(this),
				onHide: this.hideVrContext.bind(this)
			};
			return <VrContextMenu posData={contextPosData} data={vrContextItem} functions={functions}></VrContextMenu>;
		}
	}

	render() {
		return (
			<div className={styles.container}>
				<div className={styles.header}>
					<div
						style={{ paddingLeft: "10px" }}
						onClick={() => {
							this.onAddClick();
						}}
					>
						<i className={"fa fa-plus " + styles.plusIcon} />
						<FlatButton color="primary" className={styles.createBtn}>
							创建全景
						</FlatButton>
					</div>
				</div>
				{this.renderContent()}
				{this.renderCreateVrModal()}
				{this.renderVrContextMenu()}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(vrActions, dispatch),
		...bindActionCreators(sceneActions, dispatch),
		...bindActionCreators(groupActions, dispatch),
	};
}

export default connect(
	getSelector({ vrList: true }),
	mapDispatchToProps
)(VrContainer);
