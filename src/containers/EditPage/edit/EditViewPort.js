import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Snackbar, Typography } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import * as sceneActions from "../../../actions/scene";
import { getSelector } from "../../../store/getStore";
import Timer from "../../../utils/timer";

const getSceneObjData = (sceneObj, obj) => {
	let newStateObj = { max: 155, min: -5, start: 75, max1: 90, min1: -90 };
	if (sceneObj.fovmin != undefined) {
		newStateObj.min = sceneObj.fovmin;
	}
	if (sceneObj.fovmax != undefined) {
		newStateObj.max = sceneObj.fovmax;
	}
	if (sceneObj.fov != undefined) {
		newStateObj.start = sceneObj.fov;
	}
	if (sceneObj.vlookatmax != undefined) {
		newStateObj.max1 = sceneObj.vlookatmax;
	}
	if (sceneObj.vlookatmin != undefined) {
		newStateObj.min1 = sceneObj.vlookatmin;
	}
	return newStateObj;
};

class EditViewPort extends Component {
	constructor() {
		super();
		this.state = {
			max: 155,
			min: -5,
			start: 75,
			max1: 90,
			min1: -90,
			tip: {
				open: false,
				message: ""
			}
		};

		this._mounted = false;
	}

	componentDidMount() {
		this._mounted = true;
		if (this.props.sceneSelectedItem) {
			let newStateObj = getSceneObjData(this.props.sceneSelectedItem);
			Timer(100).then(() => {
				if (this._mounted) {
					this.setState(newStateObj);
				}
			});
		}
	}

	componentWillReceiveProps(props, state) {
		if (props.sceneSelected != this.props.sceneSelected) {
			if (props.sceneSelectedItem) {
				let newStateObj = getSceneObjData(props.sceneSelectedItem);
				Timer(100).then(() => {
					if (this._mounted) {
						this.setState(newStateObj);
					}
				});
			}
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	showTip(message) {
		this.setState({
			tip: {
				open: true,
				message: message
			}
		});
		Timer(1000).then(() => {
			this.setState({ tip: { open: false } });
		});
	}

	onMax1Change(event, value) {
		const { min1 } = this.state;
		if (value >= min1) {
			this.setState({ max1: value });
		}
	}

	onMin1Change(event, value) {
		const { max1 } = this.state;
		if (value <= max1) {
			this.setState({ min1: value });
		}
	}

	onMaxChange(event, value) {
		const { min, start } = this.state;
		if (value >= min && value >= start) {
			this.setState({ max: value });
		}
	}

	onMinChange(event, value) {
		const { max, start } = this.state;
		if (value <= max && value <= start) {
			this.setState({ min: value });
		}
	}

	onStartChange(event, value) {
		const { min, max } = this.state;
		if (value >= min && value <= max) {
			this.setState({ start: value });
		}
	}

	onApplyToKarpano() {
		const { max, min, start, min1, max1 } = this.state;
		const { krpano } = this.props;

		if (krpano) {
			if (min > krpano.get("view.fov")) {
				krpano.set("view.fov", min);
			}
			if (max < krpano.get("view.fov")) {
				krpano.set("view.fov", max);
			}

			krpano.set("view.fov", start);
			krpano.set("view.fovmin", min);
			krpano.set("view.fovmax", max);
			krpano.set("view.vlookatmin", min1);
			krpano.set("view.vlookatmax", max1);

			if (min1 > krpano.get("view.vlookat")) {
				krpano.set("view.vlookat", min1);
			}
			if (max1 < krpano.get("view.vlookat")) {
				krpano.set("view.vlookat", max1);
			}
		}
	}

	onConfirmToKrpano() {
		const { updateViewRange, sceneSelected } = this.props;
		const { max, min, start, max1, min1 } = this.state;

		updateViewRange(sceneSelected, start, max, min, min1, max1);

		this.showTip("视角设置保存成功");
	}

	setViewPort() {
		const { updateInitViewPort, sceneSelected } = this.props;
		updateInitViewPort(sceneSelected);
	}

	render() {
		const { max, min, start, max1, min1, tip } = this.state;
		let SliderStyle = { width: 130, verticalAlign: "-11px", marginLeft: 16, display: "inline-block" };
		let titleStyle = {
			borderBottom: "1px solid rgb(238, 238, 238)",
			marginBottom: 10,
			paddingBottom: 10,
			marginTop: 10,
			display: "block"
		};
		let conStyle = {
			border: "2px solid #eee",
			padding: 5,
			marginBottom: 10,
			borderRadius: 5,
			marginTop: 10,
			marginBottom: 10
		};
		return (
			<div style={{ padding: "5px" }}>
				<div
					style={{
						borderBottom: "1px solid #eee",
						paddingBottom: "10px"
					}}
				>
					<span>
						<i className="fa fa-eye"></i>
						<span
							style={{
								marginLeft: "5px"
							}}
						>
							视角
						</span>
					</span>
				</div>
				<div style={conStyle}>
					<div style={{ margin: "5px" }}>
						<span style={titleStyle}>视角范围设置</span>
						<div>
							<Typography style={{ display: "inline-block" }} id="label">
								最小值
							</Typography>
							<Slider style={SliderStyle} max={155} min={-5} onChange={this.onMinChange.bind(this)} value={min}></Slider>
						</div>
						<div>
							<Typography style={{ display: "inline-block" }} id="label">
								最大值
							</Typography>
							<Slider style={SliderStyle} max={155} min={-5} onChange={this.onMaxChange.bind(this)} value={max}></Slider>
						</div>
						<div>
							<Typography style={{ display: "inline-block" }} id="label">
								初始值
							</Typography>
							<Slider style={SliderStyle} max={155} min={-5} onChange={this.onStartChange.bind(this)} value={start}></Slider>
						</div>
					</div>
					<div style={{ margin: "5px" }}>
						<span style={titleStyle}>垂直视角限制</span>
						<div>
							<Typography style={{ display: "inline-block" }} id="label">
								最小值
							</Typography>
							<Slider style={SliderStyle} max={90} min={-90} onChange={this.onMin1Change.bind(this)} value={min1}></Slider>
						</div>
						<div>
							<Typography style={{ display: "inline-block" }} id="label">
								最大值
							</Typography>
							<Slider style={SliderStyle} max={90} min={-90} onChange={this.onMax1Change.bind(this)} value={max1}></Slider>
						</div>
					</div>
					<div>
						<Button color="primary" variant="contained" onClick={this.onApplyToKarpano.bind(this)}>
							应用查看效果
						</Button>
					</div>
					<div>
						<Button color="primary" variant="contained" onClick={this.setViewPort.bind(this)} style={{ marginTop: "10px", width: "100%" }}>
							将当前视角设置为初始视角
						</Button>
					</div>
				</div>
				<Button color="primary" variant="contained" style={{ float: "right" }} onClick={this.onConfirmToKrpano.bind(this)}>
					保存
				</Button>
				<Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={tip.open} message={tip.message} />
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(sceneActions, dispatch)
	};
}

export default connect(
	getSelector({
		krpano: true,
		sceneSelected: true,
		sceneSelectedItem: true
	}),
	mapDispatchToProps
)(EditViewPort);
