import React, { Component } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./HomePage";
import Header from "./Header";
import EditPage from "./EditPage";

class Root extends Component {
	render() {
		let style = { position: "fixed", top: "64px", bottom: 0, left: 0, right: 0 };
		return (
			<Provider store={this.props.store}>
				<ConnectedRouter history={this.props.history}>
					<HashRouter>
						<div>
							<Header></Header>
							<div style={style}>
								<Switch>
									<Route path="/homePage" component={HomePage} />
									<Route path="/edit/:vrid" component={EditPage} />
									<Redirect from="/" to="/homePage" />
								</Switch>
							</div>
						</div>
					</HashRouter>
				</ConnectedRouter>
			</Provider>
		);
	}
}

export default Root;
