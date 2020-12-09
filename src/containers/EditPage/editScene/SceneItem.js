import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import styles from "../../../styles/editSceneContainer.module.css";
import { getHeadImgUrl, getScenePath } from "../../../utils/pathUtils";

class Sceneitemspe extends Component {
    constructor() {
        super();
        this.state = { over: false, hover: false };
    }

    componentDidMount() {
        // console.log(this);
    }

    onDrag(event) {
        this.props.onDrag();
        let msg = JSON.stringify({ posX: event.pageX, id: this.props.item.id });
        event.dataTransfer.setData("Text", msg);
    }

    onDragOver(event) {
        const { isDragging } = this.props;
        let msg = {};
        try {
            msg = JSON.parse(event.dataTransfer.getData("Text"));
        } catch (e) {
            msg = {};
        }
        if (isDragging) {
            if (msg && msg.id != this.props.item.id) {
                this.setState({ hover: true });
                event.preventDefault();
            }
        }
    }

    onDrop(event) {
        let msg = null;
        try {
            msg = JSON.parse(event.dataTransfer.getData("Text"));
        } catch (e) {
            msg = null;
        }

        if (msg && msg.id && msg.id != this.props.item.id) {
            const { onSceneMove } = this.props;
            let thisDom = findDOMNode(this);
            let thisPos = thisDom.getBoundingClientRect();

            let thatDom = document.getElementById(`scene-to-drag-${msg.id}`);
            let thatPos = thatDom.getBoundingClientRect();

            let originPosX = msg.posX;
            let cPosX = event.pageX;

            if (cPosX - originPosX + thatPos.left > thisPos.left) {
                onSceneMove(this.props.item.id, msg.id, msg.id);
            } else {
                onSceneMove(msg.id, this.props.item.id, msg.id);
            }
        }
    }

    onDragLeave() {
        this.setState({ hover: false });
    }

    onDragEnd() {
        this.props.onDragEnd();
    }

    render() {
        const { hover } = this.state;
        const { isDragging } = this.props;
        const { item, sceneSelected, onSceneContext, sceneClickHandler } = this.props;
        let className = `${styles.scene} ${item.id == sceneSelected ? styles.selected : ""}`;

        return (
            <div
                id={`scene-to-drag-${item.id}`}
                style={{ opacity: hover && isDragging ? 0.5 : 1, overflow: "hidden" }}
                draggable
                onDrop={this.onDrop.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)}
                onDragEnd={this.onDragEnd.bind(this)}
                onDragOver={this.onDragOver.bind(this)}
                onDragStart={this.onDrag.bind(this)}
                className={styles.sceneContainer}
                key={item.id}
                onContextMenu={(e) => onSceneContext(e, item)}
                onClick={() => sceneClickHandler(item.id)}>
                <div className={className} style={{ overflow: "hidden" }}>
                    <img style={{ width: "100%", height: "100%", display: "block" }} alt='' src={getHeadImgUrl(item.id) + "?t=" + item.timestamp + "" + item.t2}></img>
                </div>
                <div className={styles.name}>{item.name}</div>
            </div>
        );
    }
}

export default Sceneitemspe;
