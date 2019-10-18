import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

import * as vrActions from "../../../actions/vr";
import * as folderActions from "../../../actions/folder";
import * as appActions from "../../../actions/app";
import * as groupActions from "../../../actions/group";
import CreateFolderModal from "./CreateFolderModal";
import VrEdit from "./VrEdit";
import FolderContextMenu from "./FolderContextMenu";
import { getSelector } from "../../../store/getStore";

import styles from "../../../styles/Home.module.css";

class VrContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posData: {},
			contextFolderData: {},
			showFolderMenu: false,
			showCreateFolderItem: false
		};
	}

	componentDidMount() {
		this.props.updateFolderFromLocal();
		this.props.updateAppTitle("全景制作工具");
		this.props.updateAppShowBack(false);
	}

	onCreateFolderClick() {
		this.setState({
			showCreateFolderItem: true,
			contextFolderData: null
		});
	}

	onFolderContext(e, item) {
		e.preventDefault();
		if (item.id === 0) return;
		this.setState({
			showFolderMenu: true,
			posData: { posX: e.clientX, posY: e.clientY },
			contextFolderData: item
		});
	}

	onFolderContextMenuHide() {
		this.setState({
			showFolderMenu: false
		});
	}

	onFolderItemClick(data) {
		if (data.id != this.props.folderSelectedId) {
			this.props.updateFolderSelected(data.id);
		}
	}

	handleEditFolder() {
		this.setState({
			showCreateFolderItem: true
		});
	}

	hideCreateFolderModal() {
		this.setState({
			showCreateFolderItem: false
		});
	}

	render() {
		return (
			<div className={styles.container}>
				<div className={styles.menu}>
					<div className={styles.projectList}>
						<div>{this.renderFolderList()}</div>
					</div>
					<div className={styles.addProject} onClick={() => this.onCreateFolderClick()}>
						<i className="fa fa-plus" />
						<span style={{ marginLeft: "17px" }}>新建文件夹</span>
					</div>
				</div>
				<div className={styles.content}>
					<VrEdit></VrEdit>
				</div>
				{this.renderCreateFolderModal()}
				{this.renderContextMenu()}
			</div>
		);
	}

	renderFolderList() {
		const { folderList, folderSelectedId } = this.props;
		let listItems = folderList.map(item => {
			let iconClassName = item.id === folderSelectedId ? "fa fa-folder-open" : "fa fa-folder";
			return (
				<ListItem style={{ padding: "5px" }} button key={item.id} onClick={_ => this.onFolderItemClick(item)} onContextMenu={e => this.onFolderContext(e, item)}>
					<ListItemIcon>
						<i className={iconClassName} style={{ top: "4px" }} aria-hidden="true" />
					</ListItemIcon>
					<ListItemText primary={item.title} />
				</ListItem>
			);
		});
		return <List component="nav">{listItems}</List>;
	}

	renderCreateFolderModal() {
		if (this.state.showCreateFolderItem) {
			const { addFolder, updateFolder } = this.props;
			const functions = {
				addFolder,
				updateFolder,
				hideCreateFolderModal: this.hideCreateFolderModal.bind(this)
			};
			const { contextFolderData } = this.state;
			return <CreateFolderModal data={contextFolderData} functions={functions} />;
		}
	}

	renderContextMenu() {
		if (this.state.showFolderMenu) {
			const { posData, contextFolderData } = this.state;
			const { deleteFolder } = this.props;
			const functions = {
				onHide: this.onFolderContextMenuHide.bind(this),
				onModify: this.handleEditFolder.bind(this),
				deleteFolder
			};
			return <FolderContextMenu posData={posData} folderData={contextFolderData} functions={functions}></FolderContextMenu>;
		}
	}
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(vrActions, dispatch),
		...bindActionCreators(folderActions, dispatch),
		...bindActionCreators(appActions, dispatch),
		...bindActionCreators(groupActions, dispatch)
	};
}

export default connect(
	getSelector({
		vrList: true,
		folderList: true,
		folderSelectedId: true
	}),
	mapDispatchToProps
)(VrContainer);
