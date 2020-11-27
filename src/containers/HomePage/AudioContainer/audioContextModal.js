import React, { Component } from "react";
import ContextModal from "../../components/ContextModal";

export default class GroupContextModal extends Component {
    onModifyClick() {
        this.props.functions.onModify(this.props.itemData);
        this.props.functions.onHide();
    }

    render() {
        const { onHide } = this.props.functions;
        const { posData } = this.props;

        return (
            <ContextModal bgClick={onHide} data={posData}>
                <ul>
                    <li>
                        <div onClick={this.onModifyClick.bind(this)}>
                            <i className='fa fa-trash'></i>
                            <span>{`编辑`}</span>
                        </div>
                    </li>
                </ul>
            </ContextModal>
        );
    }
}
