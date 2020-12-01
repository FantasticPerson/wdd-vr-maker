import React from "react";
import styles from "../../../../styles/sandContainer.module.css";

export default class MarkItem extends React.Component {
    constructor() {
        super();
        this.state = { isDragging: false, isRotating: false, isDragging1: false };
        this.handleCenter1MouseDown = this.onCenter1MouseDown.bind(this);
        this.handleCenter2MouseDown = this.onCenter2MouseDown.bind(this);
        this.handleTopMouseDown = this.onTopMouseDown.bind(this);
        this.handleMove = this.onMouseMove.bind(this);
        this.handleMouseUp = this.onMouseUp.bind(this);
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.center1) {
                this.center1.addEventListener("mousedown", this.handleCenter1MouseDown, false);
            }
            if (this.center2) {
                this.center2.addEventListener("mousedown", this.handleCenter2MouseDown, false);
            }
            if (this.top) {
                this.top.addEventListener("mousedown", this.handleTopMouseDown, false);
            }
            document.addEventListener("mousemove", this.handleMove, false);
            document.addEventListener("mouseup", this.handleMouseUp, false);
        }, 100);
    }
    onMouseMove(e) {
        const { isDragging, isRotating, isDragging1 } = this.state;
        if (isDragging || isRotating || isDragging1) {
            let subX = e.pageX - this.startX;
            let subY = e.pageY - this.startY;
            const { isSelected, mark } = this.props;
            let markWidth = isSelected ? 49 : 15;
            if (this.state.isDragging) {
                let left = mark.x - markWidth / 2 + subX;
                let top = mark.y - markWidth / 2 + subY;
                this.center2.parentNode.style.left = left + "px";
                this.center2.parentNode.style.top = top + "px";
            } else if (this.state.isRotating) {
                let angle = Math.atan2(e.pageX - this.centerX, this.centerY - e.pageY) * (180 / Math.PI);
                this.item.style.transform = "rotate(" + angle + "deg)";
            } else if (this.state.isDragging1) {
                let left = mark.x - markWidth / 2 + subX;
                let top = mark.y - markWidth / 2 + subY;
                this.center1.style.left = left + "px";
                this.center1.style.top = top + "px";
            }
        }
    }
    onMouseUp(e) {
        const { isDragging, isRotating, isDragging1 } = this.state;
        const { update, isSelected, mark } = this.props;
        if (isDragging || isRotating || isDragging1) {
            let subX = e.pageX - this.startX;
            let subY = e.pageY - this.startY;
            let markWidth = isSelected ? 49 : 15;
            if (this.state.isDragging) {
                let left = mark.x - markWidth / 2 + subX;
                let top = mark.y - markWidth / 2 + subY;
                this.center2.parentNode.style.left = left + "px";
                this.center2.parentNode.style.top = top + "px";
                update({ ...mark, x: left + markWidth / 2, y: top + markWidth / 2 });
            } else if (this.state.isRotating) {
                let angle = Math.atan2(e.pageX - this.centerX, this.centerY - e.pageY) * (180 / Math.PI);
                this.item.style.transform = "rotate(" + angle + "deg)";
                update({ ...mark, rotate: angle });
            } else if (this.state.isDragging1) {
                let left = mark.x - markWidth / 2 + subX;
                let top = mark.y - markWidth / 2 + subY;
                this.center1.style.left = left + "px";
                this.center1.style.top = top + "px";
                update({ ...mark, x: left + markWidth / 2, y: top + markWidth / 2 });
            }
        }
        this.setState({
            isDragging1: false,
            isDragging: false,
            isRotating: false,
        });
    }
    onCenter1MouseDown(e) {
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.setState({
            isDragging1: true,
            isDragging: false,
            isRotating: false,
        });
    }
    onCenter2MouseDown(e) {
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.setState({
            isDragging1: false,
            isDragging: true,
            isRotating: false,
        });
    }

    onItemClick() {
        setTimeout(() => {
            const { isDragging1 } = this.state;
            if (!isDragging1) {
                const { mark, onMarkClick } = this.props;
                onMarkClick(mark);
            }
        }, 200);
    }
    onTopMouseDown(e) {
        const { top, left, width, height } = this.item.getBoundingClientRect();
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.centerX = left + width / 2;
        this.centerY = top + height / 2;
        this.setState({
            isDragging1: false,
            isDragging: false,
            isRotating: true,
        });
    }
    render() {
        const { isSelected, mark } = this.props;
        let markWidth = isSelected ? 49 : 15;
        let left = mark.x - markWidth / 2;
        let top = mark.y - markWidth / 2;
        let style = {
            top,
            left,
            transform: "rotate(" + mark.rotate + "deg)",
        };
        if (!isSelected) {
            return (
                <React.Fragment>
                    <div
                        onClick={this.onItemClick.bind(this)}
                        className={styles.markItemPoint}
                        style={style}
                        ref={(c) => {
                            this.center1 = c;
                        }}></div>
                </React.Fragment>
            );
        } else {
            return (
                <div className={styles.markItemPoint2} style={style} ref={(c) => (this.item = c)}>
                    <div className={styles.centerPoint} ref={(c) => (this.center2 = c)}></div>
                    <div className={styles.topPoint} ref={(c) => (this.top = c)}></div>
                </div>
            );
        }
    }
}
