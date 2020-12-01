import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FlatButton from "@material-ui/core/Button";

import UploadAudioModal from "./components/UploadAudioModal";
import CopyAudioTmpToAudio from "../../../native/copyAudioTmpToAudio";
import AudioListModal from "./components/AudioListModal";

import * as audioActions from "../../../actions/audio";
import * as vrActions from "../../../actions/vr";
import * as GroupActions from "../../../actions/group";
import * as sceneActions from "../../../actions/scene";

import { getSelector } from "../../../store/getStore";

class EditMusic extends Component {
    constructor() {
        super();
        this.state = { showUploadModal: false, showListModal: false, check: true, type: 0, music1: null, music2: null };
    }

    componentDidMount() {
        const { sceneSelectedItem } = this.props;
        if (sceneSelectedItem) {
            this.setState({ music1: sceneSelectedItem.music1, music2: sceneSelectedItem.music2 });
        }
    }

    onAddMusicLocal(type) {
        this.setState({ type: type, showUploadModal: true });
    }

    onAddMusic2(type) {
        this.setState({ type: type, showListModal: true });
    }

    hideUpload() {
        this.setState({ showUploadModal: false });
    }

    onUploadConfirm(path, name) {
        CopyAudioTmpToAudio(path).then(() => {
            const { addAudio } = this.props;
            let arr = path.split(".");
            let picItem = {
                id: arr[0],
                extension: arr[1],
                showName: name,
            };
            addAudio(picItem);
            setTimeout(() => {
                var name = `${arr[0]}.${arr[1]}`;
                if (this.state.type == 1) {
                    this.setState({ music1: { url: name, name: picItem.showName } });
                } else {
                    this.setState({ music2: { url: name, name: picItem.showName } });
                }
            }, 300);
        });
        this.hideUpload();
    }

    renderUploadModal() {
        if (this.state.showUploadModal) {
            return <UploadAudioModal onCancel={this.hideUpload.bind(this)} onConfirm={this.onUploadConfirm.bind(this)}></UploadAudioModal>;
        }
    }

    onLocalListCancel() {
        this.setState({ showListModal: false });
    }

    onLocalListConfirm(name, showName) {
        if (this.state.type == 1) {
            this.setState({ music1: { url: name, name: showName } });
        } else {
            this.setState({ music2: { url: name, name: showName } });
        }
        this.onLocalListCancel();
    }

    renderListModal() {
        if (this.state.showListModal) {
            return <AudioListModal onCancel={this.onLocalListCancel.bind(this)} onConfirm={this.onLocalListConfirm.bind(this)}></AudioListModal>;
        }
    }

    onRemoveMusic1() {
        this.setState({ music1: null });
    }

    renderMusic() {
        const { music1 } = this.state;
        if (music1) {
            return (
                <div>
                    {music1.name}
                    <FlatButton color='primary' onClick={() => this.onRemoveMusic1()}>
                        删除
                    </FlatButton>
                </div>
            );
        }
    }

    onRemoveMusic2() {
        this.setState({ music2: null });
    }

    renderMusic2() {
        const { music2 } = this.state;
        if (music2) {
            return (
                <div>
                    {music2.name}
                    <FlatButton color='primary' onClick={() => this.onRemoveMusic2()}>
                        删除
                    </FlatButton>
                </div>
            );
        }
    }

    onConfirmClick() {
        const { onfinish, updateSceneMusic, sceneSelectedItem } = this.props;
        const { music1, music2 } = this.state;
        if (sceneSelectedItem) {
            updateSceneMusic(sceneSelectedItem, music1, music2);
            onfinish();
        }
    }

    onAllConfirmClick() {
        const { onfinish, updateAllMusic, sceneList,allSceneList } = this.props;
        const { music1, music2 } = this.state;
        if (sceneList.length > 0) {
            updateAllMusic(allSceneList, music1, music2);
            onfinish();
        }
    }

    render() {
        let titleStyle = {
            marginBottom: 10,
            paddingBottom: 10,
        };
        let conStyle = {
            border: "2px solid #eee",
            padding: 5,
            marginBottom: 10,
            borderRadius: 5,
        };
        return (
            <div style={{ padding: "5px" }}>
                <div style={{ borderBottom: "1px solid #eee", ...titleStyle }}>
                    <span>
                        <i className='fa fa-music'></i>
                        <span style={{ marginLeft: "5px" }}>音乐</span>
                    </span>
                </div>
                <div style={conStyle}>
                    <div style={{ marginTop: "10px", borderBottom: "1px solid #eee", ...titleStyle, marginTop: 10 }}>背景音乐设置</div>
                    <div>
                        <span>选择一首音乐</span>
                        <div>
                            <FlatButton color='primary' onClick={() => this.onAddMusicLocal(1)}>
                                本地添加
                            </FlatButton>
                            <FlatButton color='primary' onClick={() => this.onAddMusic2(1)}>
                                音乐库添加
                            </FlatButton>
                        </div>
                        {this.renderMusic()}
                    </div>

                    <div style={{ marginTop: "10px", borderBottom: "1px solid #eee", ...titleStyle }}>解说音乐设置</div>
                    <div>
                        <span>选择一首音乐</span>
                        <div>
                            <FlatButton color='primary' onClick={() => this.onAddMusicLocal(2)}>
                                本地添加
                            </FlatButton>
                            <FlatButton color='primary' onClick={() => this.onAddMusic2(2)}>
                                音乐库添加
                            </FlatButton>
                        </div>
                        {this.renderMusic2()}
                    </div>
                </div>
                <FlatButton color='primary' variant='contained' onClick={this.onConfirmClick.bind(this)}>
                    确定
                </FlatButton>
                <FlatButton color='primary' variant='contained' style={{ float: "right" }} onClick={this.onAllConfirmClick.bind(this)}>
                    应用到全部分组
                </FlatButton>
                {this.renderUploadModal()}
                {this.renderListModal()}
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
)(EditMusic);
