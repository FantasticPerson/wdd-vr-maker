import React, { Component } from "react";
import { getImagePath } from "../../../utils/pathUtils";
import styles from "../../../styles/vrItem.module.css";

export default class VrItem extends Component {
	constructor(props) {
		super(props);
	}

	onItemDbClick() {
		const { history } = this.props;
		const { data } = this.props;
		history.push(`/edit/${data.id}`);
	}

	renderImage() {
		const { data } = this.props;
		if (data.headImg && data.headImg.length > 0) {
			return <img style={{ height: "100%" }} src={getImagePath(data.headImg)}></img>;
		}
	}

	render() {
		const { data, onContextMenu } = this.props;
		return (
			<div
				className={styles.container}
				onDoubleClick={this.onItemDbClick.bind(this)}
				onContextMenu={e => {
					onContextMenu(e, data);
				}}
			>
				<div className={styles.imgContainer}>{this.renderImage()}</div>
				<div className={styles.name}>{data.title}</div>
			</div>
		);
	}
}
