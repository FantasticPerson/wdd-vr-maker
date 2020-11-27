import React from "react";

export default class PicItem extends React.Component {
    render() {
        const { url } = this.props;
        return <img src={url} alt='' style={{ width: "200px" }} />;
    }
}
