import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AudioItem from "./audioItem";
import { getSelector } from "../../../store/getStore";
import styles from "../../../styles/AudioContainer.module.css";
import AudioContextModal from "./audioContextModal";
import UploadAudioModal from "./UploadAudioModal";
import * as AudioActions from "../../../actions/audio";
import ReplaceAudio from "../../../native/replaceAudio";

class AudioContainer extends Component {
    constructor() {
        super();
        this.state = {
            showModify: false,
            currentItem: null,
            posData: null,
            showEdit: false,
        };
    }
    onItemContext(e, item) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            showModify: true,
            currentItem: item,
            posData: { posX: e.clientX, posY: e.clientY },
        });
    }

    onItemModify() {
        this.setState({
            showEdit: true,
        });
    }
    onHideContext() {
        this.setState({
            showModify: false,
        });
    }

    onConfirmClick(audioName, showName) {
        const { currentItem } = this.state;
        const { updateAudio } = this.props;
        this.setState({ showEdit: false });
        ReplaceAudio(audioName, currentItem.id + "." + currentItem.extension).then(() => {
            let AudioItem = {
                ...currentItem,
                showName: showName,
                t2: new Date().valueOf(),
            };
            updateAudio(AudioItem);
        });
    }

    onCancel() {
        this.setState({ showEdit: false });
    }
    render() {
        let audioItems = this.props.audioList
            .map((item) => {
                return <AudioItem key={item.timestamp} data={item} onContext={this.onItemContext.bind(this)}></AudioItem>;
            })
            .concat(
                new Array(16).fill(0).map((item, index) => {
                    return <div className={styles.placeHolder} key={item + "" + index}></div>;
                })
            );

        return (
            <div className={styles.container}>
                {audioItems}
                {this.renderContextModal()}
                {this.renderModifyModal()}
            </div>
        );
    }
    renderModifyModal() {
        // console.log(this.state.showEdit);
        if (this.state.showEdit) {
            const { currentItem } = this.state;

            return <UploadAudioModal itemData={currentItem} onConfirm={this.onConfirmClick.bind(this)} onCancel={this.onCancel.bind(this)}></UploadAudioModal>;
        }
    }

    renderContextModal() {
        const { showModify, currentItem, posData } = this.state;
        if (showModify) {
            let functions = {
                onModify: this.onItemModify.bind(this),
                onHide: this.onHideContext.bind(this),
            };
            return <AudioContextModal posData={posData} functions={functions} itemData={currentItem} />;
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(AudioActions, dispatch),
    };
}

export default connect(
    getSelector({
        audioList: true,
    }),
    mapDispatchToProps
)(AudioContainer);
