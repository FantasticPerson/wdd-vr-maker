import React, { Component } from "react";
import { getAudioPath } from "../../../utils/pathUtils";
import styles from "../../../styles/AudioContainer.module.css";

export default class AudioItem extends Component {
	constructor() {
		super();
		this.audioObj = null;
		this.state = { playing: false };
	}

	render() {
		const { data } = this.props;
		let source = getAudioPath(data.id + "." + data.extension);
		return (
			<div style={{ margin: "5px" }}>
				<div className={styles["audio-item"]}>
					{this.renderIcon()}
					<audio className={styles.audio} ref={audio => (this.audioObj = audio)} src={source} loop></audio>
				</div>
				<div className={styles.title} title={data.showName}>
					{data.showName}
				</div>
			</div>
		);
	}

	play() {
		if (this.audioObj) {
			this.audioObj.play();
			this.setState({ playing: true });
		}
	}

	pause() {
		if (this.audioObj) {
			this.audioObj.pause();
			this.setState({ playing: false });
		}
	}

	renderIcon() {
		if (!this.state.playing) {
			return (
				<span onClick={this.play.bind(this)} className={styles.btnStyle}>
					<i className={`iconfont icon-play ${styles.iconStyle}`}></i>
				</span>
			);
		} else {
			return (
				<span onClick={this.pause.bind(this)} className={styles.btnStyle}>
					<i className={`iconfont icon-pause ${styles.iconStyle}`}></i>
				</span>
			);
		}
	}
}
