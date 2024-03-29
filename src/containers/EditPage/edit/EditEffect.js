import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button as FlatButton, Radio as RadioButton, RadioGroup as RadioButtonGroup, FormControlLabel } from "@material-ui/core";
import { getSelector } from "../../../store/getStore";
import * as krpanoActions from "../../../actions/krpano";
import * as sceneActions from "../../../actions/scene";

class EditEffect extends Component {
	constructor() {
		super();
		this.state = { rainType: "0", snowType: "0" };
	}

	componentDidMount() {
		const { sceneSelectedItem, AddEffect, AddSunlight } = this.props;

		if (sceneSelectedItem.hasOwnProperty("effectType") && sceneSelectedItem.hasOwnProperty("effectLevel")) {
			if (sceneSelectedItem.effectType == "rain") {
				this.setState({ rainType: sceneSelectedItem.effectLevel });
				AddEffect("rain", sceneSelectedItem.effectLevel);
			} else {
				this.setState({ snowType: sceneSelectedItem.effectLevel });
				AddEffect("snow", sceneSelectedItem.effectLevel);
			}
		}
		if (sceneSelectedItem.hasOwnProperty("sunlight")) {
			let sunlight = sceneSelectedItem.sunlight;
			if (sunlight && sunlight.length > 0) {
				let sunObj = JSON.parse(sunlight);
				AddSunlight(sunObj);
			}
		}
	}

	componentWillReceiveProps(obj, cObj) {
		let nItem = obj.sceneSelectedItem;
		let cItem = cObj.sceneSelectedItem;

		const { AddEffect } = this.props;

		if ((nItem && !cItem) || (nItem && cItem && nItem.id != cItem.id)) {
			if (nItem.hasOwnProperty("effectType") && nItem.hasOwnProperty("effectLevel")) {
				if (nItem.effectType == "rain") {
					this.setState({ rain: nItem.effectLevel });
					AddEffect("rain", nItem.effectLevel);
				} else {
					this.setState({ snow: nItem.effectLevel });
					AddEffect("snow", nItem.effectLevel);
				}
			}
		}
	}

	onSelectEffectConfirm() {
		const { rainType, snowType } = this.state;
		const { updateEffect, sceneSelected, onfinish } = this.props;

		if (rainType > 0) {
			updateEffect(sceneSelected, "rain", rainType);
		} else if (snowType > 0) {
			updateEffect(sceneSelected, "snow", snowType);
		}
		onfinish();
	}

	onChooseSpecislShowChange(event, value) {
		const { AddEffect } = this.props;

		if (event.target.name == "rain") {
			if (value != "0") {
				this.setState({ snowType: "0" });
			}
			this.setState({ rainType: value });
			AddEffect("rain", value);
		} else {
			if (value != "0") {
				this.setState({ rainType: "0" });
			}
			this.setState({ snowType: value });
			AddEffect("snow", value);
		}
	}

	addSunlight() {
		const { sceneSelectedItem } = this.props;
		if (sceneSelectedItem) {
			if (sceneSelectedItem.sunlight && sceneSelectedItem.sunlight.length > 0) {
				return;
			}
			const { addSunlight, sceneSelected } = this.props;
			addSunlight(sceneSelected);
		}
	}

	removeSunlight() {
		const { sceneSelectedItem, removeSunlight } = this.props;
		if (sceneSelectedItem) {
			if (sceneSelectedItem.sunlight && sceneSelectedItem.sunlight.length > 0) {
				removeSunlight(sceneSelectedItem.id);
			}
		}
	}

	render() {
		let titleStyle = {
			marginBottom: 10,
			paddingBottom: 10,
			marginTop: 10
		};
		let conStyle = {
			border: "2px solid #eee",
			padding: 5,
			marginBottom: 10,
			borderRadius: 5
		};
		let rainTypes = ["关闭", "小雨", "中雨", "大雨"];
		let snowTypes = ["关闭", "小雪", "中雪", "大雪"];

		let rainFormControls = rainTypes.map((item, index) => {
			return <FormControlLabel key={index} value={index + ""} style={{ height: "25px" }} control={<RadioButton color="primary" />} label={item} />;
		});

		let snowFormControls = snowTypes.map((item, index) => {
			return <FormControlLabel key={index} value={index + ""} style={{ height: "25px" }} control={<RadioButton color="primary" />} label={item} />;
		});

		const { rainType, snowType } = this.state;
		let btnStyle = { marginLeft: "10px" };

		return (
			<div style={{ padding: "5px" }}>
				<div style={{ borderBottom: "1px solid #eee", ...titleStyle }}>
					<span>
						<i className="fa fa-magic"></i>
						<span style={{ marginLeft: "5px" }}>特效编辑</span>
					</span>
				</div>
				<div style={conStyle}>
					<FlatButton variant="contained" color="primary" onClick={this.addSunlight.bind(this)}>
						添加阳光
					</FlatButton>
					<FlatButton color="secondary" variant="contained" style={btnStyle} onClick={this.removeSunlight.bind(this)}>
						删除
					</FlatButton>
					<div style={{ borderBottom: "1px solid #eee", ...titleStyle }}>下雨</div>
					<RadioButtonGroup name="rain" value={rainType} onChange={this.onChooseSpecislShowChange.bind(this)}>
						{rainFormControls}
					</RadioButtonGroup>

					<div style={{ borderBottom: "1px solid #eee", ...titleStyle }}>下雪</div>
					<RadioButtonGroup name="snow" value={snowType} onChange={this.onChooseSpecislShowChange.bind(this)}>
						{snowFormControls}
					</RadioButtonGroup>
				</div>
				<FlatButton variant="contained" color="primary" onClick={this.onSelectEffectConfirm.bind(this)} color="primary" style={{ marginLeft: "155px" }}>
					确定
				</FlatButton>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(sceneActions, dispatch),
		...bindActionCreators(krpanoActions, dispatch)
	};
}

export default connect(
	getSelector({
		sceneSelectedItem: true,
		sceneSelected: true
	}),
	mapDispatchToProps
)(EditEffect);
