import React from "react";
import { getImagePath } from "../../../../utils/pathUtils";
import styles from "../../../../styles/sandContainer.module.css";
import MarkItem from "./markItem";

export default class extends React.Component {
    constructor() {
        super();
        this.state = { picItem: null, marks: [], markSelect: null };
    }
    componentDidMount() {
        const { picItem, marks } = this.props;
        this.setState({ picItem, marks });
    }
    componentWillReceiveProps(props) {
        const { picItem, marks } = props;
        this.setState({ picItem, marks });
    }
    render() {
        const { picItem } = this.state;
        if (picItem) {
            return (
                <div className={styles.sandContainer}>
                    <img className={styles.bigImg} alt='' src={getImagePath(picItem.name)}></img>
                    {this.renderMarks()}
                </div>
            );
        }
        return <div className={styles.sandContainer}></div>;
    }

    renderMarks() {
        const { markSelect, update, onMarkClick, sceneSelected } = this.props;
        const { marks } = this.state;
        let marksDom = marks.map((item) => {
            let isSelected = false;
            if (item.id === sceneSelected) {
                isSelected = true;
            }
            return <MarkItem onMarkClick={onMarkClick} update={update} isSelected={isSelected} mark={item}></MarkItem>;
        });
        return <div className={styles.marksContainer}>{marksDom}</div>;
    }
}
