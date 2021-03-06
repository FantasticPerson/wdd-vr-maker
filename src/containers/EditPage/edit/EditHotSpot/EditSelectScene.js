import React, { Component } from "react";
import { Select as SelectField, MenuItem, Checkbox, FormControlLabel } from "@material-ui/core";

import { getHeadImgUrl } from "../../../../utils/pathUtils";

export default class EditSelectScene extends Component {
	constructor() {
		super();
		this.state = { selectId: null, type: 0, check: true };
	}

	componentDidMount() {
		const { action } = this.props;
		if (action.length > 0) {
			let obj = JSON.parse(action);
			this.setState({ selectId: obj.toId, value: obj.type, check: obj.check });
		}
	}

	getResult() {
		const { selectId, type, check } = this.state;
		if (selectId != null) {
			return JSON.stringify({ type: "switch", toId: this.state.selectId, switchType: type, check: check });
		}
		return "";
	}

	onItemClick(id) {
		this.setState({ selectId: id });
	}

	onConfirm() {
		const { selectId } = this.state;
		return selectId;
	}

	onTypeChange(event) {
		this.setState({ type: event.target.value });
	}

	updateCheck() {
		this.setState({ check: !this.state.check });
	}

	render() {
		const { selectId } = this.state;
		const { sceneList, folderId, vrId, sceneSelected } = this.props;

		let sceneItemStyle = {
			margin: "5px",
			height: "80px",
			width: "80px",
			display: "inline-block",
			overflow: "hidden"
		};

		let sceneArrRes = sceneList.filter(item => {
			return item.id != sceneSelected;
		});

		let sceneArr = sceneArrRes.map(item => {
			let itemStyle = sceneItemStyle;
			if (selectId == item.id) {
				itemStyle = { ...itemStyle, border: "3px solid blanchedalmond" };
			}

			return (
				<div onClick={() => this.onItemClick(item.id)} style={itemStyle} key={item.id}>
					<div style={{ height: "80px", width: "80px", overflow: "hidden" }}>
						<img style={{ height: "80px", width: "80px" }} src={getHeadImgUrl(item.id)} />
					</div>
				</div>
			);
		});
		let switchTypes = ["淡入淡出", "缩放过渡", "黑场过渡", "白场过渡", "从右至左", "对角线", "原型展开", "水平展开", "椭圆缩放"];
		let swtichItems = switchTypes.map((item, i) => {
			return (
				<MenuItem value={i} key={i}>
					{item}
				</MenuItem>
			);
		});
		return (
			<div>
				<div style={{ width: "180px", margin: "0 auto" }}>
					<SelectField value={this.state.type} onChange={this.onTypeChange.bind(this)}>
						{swtichItems}
					</SelectField>

					<FormControlLabel control={<Checkbox checked={this.state.check} onChange={this.updateCheck.bind(this)} value="在新窗口中打开" color="primary" />} label="在新窗口中打开" />
					{sceneArr}
				</div>
			</div>
		);
	}
}
