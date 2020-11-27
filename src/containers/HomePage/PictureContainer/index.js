import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getImagePath } from "../../../utils/pathUtils";
import { getSelector } from "../../../store/getStore";
import styles from "../../../styles/PictureContainer.module.css";
import PicContextModal from "./picContextModal";
import UploadPicModal from "./UploadPicModal";
import ReplaceImage from "../../../native/replaceImage";
import * as PicActions from "../../../actions/picture";

class PictureContainer extends Component {
    constructor() {
        super();
        this.state = {
            showModify: false,
            currentItem: null,
            posData: null,
            showEdit: false,
            showPics: true,
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

    onConfirmClick(imageName, showName) {
        const { currentItem } = this.state;
        const { updatePicture } = this.props;

        this.setState({ showEdit: false });
        ReplaceImage(imageName, currentItem.id + "." + currentItem.extension).then(() => {
            let picItem = {
                ...currentItem,
                showName: showName,
                t2: new Date().valueOf(),
            };
            updatePicture(picItem);
        });
    }

    onCancel() {
        this.setState({ showEdit: false });
    }

    render() {
        const { showPics } = this.state;
        let picItems = this.props.picList
            .map((item) => {
                let url = getImagePath(item.id + "." + item.extension);
                return (
                    <div
                        key={item.timestamp}
                        style={{ padding: "5px 0" }}
                        onContextMenu={(e) => {
                            this.onItemContext(e, item);
                        }}>
                        <div className={styles.pic}>
                            <img src={url + "?=t" + item.timestamp + "" + item.t2} alt='' style={{ width: "200px" }} />
                        </div>
                        <span className={styles.span}>{item.showName}</span>
                    </div>
                );
            })
            .concat(
                new Array(16).fill(0).map((item, index) => {
                    return <div style={{ width: "200px" }} key={item + "" + index}></div>;
                })
            );

        return (
            <div className={styles.container}>
                {showPics ? picItems : null}
                {this.renderContextModal()}
                {this.renderModifyModal()}
            </div>
        );
    }

    renderModifyModal() {
        if (this.state.showEdit) {
            const { currentItem } = this.state;

            return <UploadPicModal itemData={currentItem} onConfirm={this.onConfirmClick.bind(this)} onCancel={this.onCancel.bind(this)}></UploadPicModal>;
        }
    }

    renderContextModal() {
        const { showModify, currentItem, posData } = this.state;
        if (showModify) {
            let functions = {
                onModify: this.onItemModify.bind(this),
                onHide: this.onHideContext.bind(this),
            };
            return <PicContextModal posData={posData} functions={functions} itemData={currentItem} />;
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(PicActions, dispatch),
    };
}

export default connect(
    getSelector({
        picList: true,
    }),
    mapDispatchToProps
)(PictureContainer);
