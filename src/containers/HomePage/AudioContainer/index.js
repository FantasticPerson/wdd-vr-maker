import React, { Component } from "react";
import { connect } from "react-redux";
import AudioItem from "./audioItem";
import { getSelector } from "../../../store/getStore";
import styles from "../../../styles/AudioContainer.module.css";

class AudioContainer extends Component {
	constructor() {
		super();
	}

	render() {
		let audioItems = this.props.audioList
			.map(item => {
				return <AudioItem key={item.timestamp} data={item}></AudioItem>;
			})
			.concat(
				new Array(16).fill(0).map((item, index) => {
					return <div className={styles.placeHolder} key={item + "" + index}></div>;
				})
			);

		return <div className={styles.container}>{audioItems}</div>;
	}
}

export default connect(
	getSelector({
		audioList: true
	}),
	null
)(AudioContainer);
