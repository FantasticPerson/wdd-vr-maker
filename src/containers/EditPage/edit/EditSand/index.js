import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button as FlatButton, FormControlLabel, Checkbox } from "@material-ui/core";
import UploadPicModal from "../components/UploadPicModal";
import PicListModal from "../components/PicListModal";
import CopyImageTmpToImage from "../../../../native/copyImageTmpToImage";
import getPathOfImage from "../../../../native/getPathOfImage";
import CheckSandPic from "../../../../utils/checkSandPic";

import * as audioActions from "../../../../actions/audio";
import * as vrActions from "../../../../actions/vr";
import * as GroupActions from "../../../../actions/group";
import * as sceneActions from "../../../../actions/scene";

import { getSelector } from "../../../../store/getStore";
import { getImagePath, getHeadImgUrl } from "../../../../utils/pathUtils";
import styles from "../../../../styles/sandContainer.module.css";

import SandContainer from "./sandContainer";

class EditSand extends Component {
    constructor() {
        super();
        this.state = { check: false, showUploadModal: false, showPicListModal: false, sandSrc: null, picItem: null, marks: [], showSceneList: false, markSelect: null };
    }

    componentDidMount() {
        const { sceneSelectedItem } = this.props;
        if (sceneSelectedItem) {
            let sandObj = sceneSelectedItem.sandObj;
            if (sandObj) {
                let parsedSandObj = JSON.parse(sandObj);
                this.setState({ picItem: parsedSandObj.picItem, marks: parsedSandObj.marks || [] });
            }
        }
    }

    onConfirmClick() {
        this.updateSandObj();
        setTimeout(() => {
            const { onfinish } = this.props;
            onfinish();
        }, 50);
    }

    updateSandObj() {
        // console.log(this.props);
        const { picItem, marks } = this.state;
        const { updateSand, sceneSelectedItem, sceneSelected } = this.props;
        let sandObj = picItem ? { picItem, marks: marks || [] } : null;
        updateSand(sceneSelectedItem.sandObj, sandObj, sceneSelected);
    }

    updateCheck() {
        this.setState({ check: !this.state.check });
    }

    hideUploadPic() {
        this.setState({ showUploadModal: false });
    }

    onUploadConfirm(path, showName) {
        CopyImageTmpToImage(path).then(() => {
            const { addPicture } = this.props;
            let arr = path.split(".");
            let newPicItem = {
                id: arr[0],
                extension: arr[1],
                showName: showName,
            };
            CheckSandPic(getPathOfImage(true, path)).then((res) => {
                if (res) {
                    addPicture(newPicItem);
                    setTimeout(() => {
                        var newName = newPicItem.id + "." + newPicItem.extension;
                        let newItem = { name: newName, showName: showName };
                        this.setState({ picItem: newItem });
                        this.updateSceneItem();
                    }, 300);
                    this.hideUploadPic();
                } else {
                    alert("图片尺寸不对");
                }
            });
        });
    }

    renderUploadModal() {
        if (this.state.showUploadModal) {
            return <UploadPicModal onCancel={this.hideUploadPic.bind(this)} onConfirm={this.onUploadConfirm.bind(this)}></UploadPicModal>;
        }
    }

    onLocalPicListCancel() {
        this.setState({ showPicListModal: false });
    }

    onLocalPicListConfirm(arr) {
        let picItem = arr[0];
        let oldPicItem = this.state.picItem;
        if (picItem && picItem.name !== oldPicItem.name) {
            this.setState({ picItem: picItem });
            this.updateSceneItem();
        }
        this.onLocalPicListCancel();
    }

    renderPicListModal() {
        if (this.state.showPicListModal) {
            return <PicListModal isSignel onCancel={this.onLocalPicListCancel.bind(this)} onConfirm={this.onLocalPicListConfirm.bind(this)}></PicListModal>;
        }
    }
    onRemoveClick() {
        this.setState({ picItem: null });
        // this.updateSandObj()
        // this.updateSceneItem();
    }

    updateSceneItem() {
        // setTimeout(() => {
        //     const { picItem, marks } = this.state;
        //     const { updateSand, sceneSelectedItem } = this.props;
        //     let sandObj = null;
        //     if (picItem) {
        //         sandObj = { picItem: picItem, marks };
        //     }
        //     updateSand(sandObj);
        // }, 100);
    }

    renderSandPic() {
        const { picItem } = this.state;
        let picConstyle = {
            width: 150,
            height: 150,
            border: "1px dashed #333",
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "10px 0",
            flexDirection: "column",
            position: "relative",
        };
        let picStyle = {
            width: 150,
            height: 150,
        };
        if (picItem) {
            return (
                <div style={picConstyle}>
                    <i onClick={() => this.onRemoveClick()} className='fa fa-times pictureCloseBtn' aria-hidden='true'></i>
                    <img style={picStyle} src={getImagePath(picItem.name)} alt=''></img>
                </div>
            );
        } else {
            return (
                <div style={picConstyle}>
                    <p>建议尺寸:</p>
                    <p>480 x 480</p>
                </div>
            );
        }
    }

    updateMarkItem(item) {
        let marks = this.state.marks;
        let sItem = marks.find((item2) => item.id == item2.id);
        if (sItem) {
            let index = marks.indexOf(sItem);
            marks.splice(index, 1, item);
            this.setState({ marks: marks });
        }
    }

    onSceneSelect(item) {
        let marks = this.state.marks;
        marks.push({ id: item.id, name: item.name, x: 240, y: 240, rotate: 0 });
        this.setState({ marks: marks, showSceneList: false, markSelect: { id: item.id, name: item.name } });
    }

    onRemoveMark(item) {
        let marks = this.state.marks;
        marks = marks.filter((item2) => item2.id !== item.id);
        this.setState({ marks: marks });
    }
    onAddMarkClick() {
        this.setState({ showSceneList: true });
    }
    onAddSceneClose() {
        this.setState({ showSceneList: false });
    }

    renderSandContainer() {
        const { sceneSelected } = this.props;
        const { picItem, marks, markSelect } = this.state;
        if (picItem) {
            return <SandContainer onMarkClick={this.onMarkClick.bind(this)} update={this.updateMarkItem.bind(this)} sceneSelected={sceneSelected} picItem={picItem} marks={marks} markSelect={markSelect}></SandContainer>;
        }
    }

    onMarkClick(item) {
        const { updateSceneSelected, sceneSelected } = this.props;
        if (item.id != sceneSelected) {
            this.updateSandObj();
            setTimeout(() => {
                updateSceneSelected(item.id);
            }, 50);
        }
    }

    renderEditMark() {
        const { picItem, marks, showSceneList } = this.state;
        if (picItem) {
            const { allSceneList } = this.props;
            let sceneArr = allSceneList.filter((item) => {
                let hasSelect = marks.find((item2) => item2.id == item.id);
                if (hasSelect) return false;
                return true;
            });
            let sceneItemStyle = {
                margin: "5px",
                height: "120px",
                width: "80px",
                display: "inline-block",
                overflow: "hidden",
            };
            let sceneGroups = {};
            sceneArr.map((item) => {
                if (!sceneGroups[item.groupId]) {
                    sceneGroups[item.groupId] = [];
                }
                sceneGroups[item.groupId].push(item);
                return "";
            });
            let showLine = true;
            if (sceneGroups.length <= 1) {
                showLine = false;
            }
            sceneArr = Object.keys(sceneGroups).map((item) => {
                let list = sceneGroups[item];
                let arr = list.map((item) => {
                    let itemStyle = sceneItemStyle;
                    return (
                        <div onClick={() => this.onSceneSelect(item)} style={itemStyle} key={item.id}>
                            <div style={{ height: "120px", width: "100%", overflow: "hidden" }}>
                                <img style={{ height: "80px", width: "80px" }} alt='' src={getHeadImgUrl(item.id)} />
                                <div style={{ textAlign: "center" }}>{item.name}</div>
                            </div>
                        </div>
                    );
                });
                return (
                    <React.Fragment>
                        <div style={{ display: showLine ? "block" : "none" }}>-------------------------</div>
                        {arr}
                    </React.Fragment>
                );
            });
            let marksArr = marks.map((item) => {
                return (
                    <div className={styles.markItem}>
                        <i onClick={() => this.onRemoveMark(item)} className='fa fa-times pictureCloseBtn' aria-hidden='true'></i>
                        {item.name}
                    </div>
                );
            });
            return (
                <div
                    className={styles.sceneContainer}
                    style={{
                        position: "absolute",
                        bottom: 50,
                        top: 295,
                        overflow: "auto",
                    }}>
                    {showSceneList ? (
                        <div>
                            <div>选择场景</div>
                            {sceneArr}
                            <FlatButton onClick={this.onAddSceneClose.bind(this)}>关闭</FlatButton>
                        </div>
                    ) : (
                        <div>
                            <div className={styles.sceneTitle}>
                                <div onClick={this.onAddMarkClick.bind(this)}>添加标记</div>
                                {marksArr}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    }

    render() {
        let titleStyle = {
            marginBottom: 10,
            paddingBottom: 10,
        };
        return (
            <div style={{ padding: "5px", position: "relative", height: "100%" }}>
                <div style={{ borderBottom: "1px solid #eee", ...titleStyle }}>
                    <span>
                        <i className='fa fa-music'></i>
                        <span style={{ marginLeft: "5px" }}>沙盘</span>
                    </span>
                </div>
                <div>
                    <FormControlLabel control={<Checkbox checked={this.state.check} onChange={this.updateCheck.bind(this)} color='primary' />} label='打开全景时自动打开' />
                    <br />
                    <FlatButton color='primary' variant='contained' style={{ display: "inline-block" }} onClick={() => this.setState({ showPicListModal: true })}>
                        {"图片库添加"}
                    </FlatButton>
                    <FlatButton color='primary' variant='contained' style={{ display: "inline-block", float: "right" }} onClick={() => this.setState({ showUploadModal: true })}>
                        {"添加图片"}
                    </FlatButton>
                    {this.renderSandPic()}
                </div>
                {this.renderUploadModal()}
                {this.renderPicListModal()}
                {this.renderEditMark()}
                {this.renderSandContainer()}
                <FlatButton color='primary' style={{ marginTop: 30, position: "absolute", bottom: 5 }} variant='contained' onClick={this.onConfirmClick.bind(this)}>
                    确定
                </FlatButton>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(audioActions, dispatch),
        ...bindActionCreators(vrActions, dispatch),
        ...bindActionCreators(GroupActions, dispatch),
        ...bindActionCreators(sceneActions, dispatch),
    };
}

export default connect(
    getSelector({
        groupSelectId: true,
        groupList: true,
        vrItem: true,
        groupSelectItem: true,
        sceneSelected: true,
        sceneSelectedItem: true,
        sceneList: true,
        allSceneList: true,
    }),
    mapDispatchToProps
)(EditSand);
