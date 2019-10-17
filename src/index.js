import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import dbConfig from "./db";
import App from "./containers/App";
import * as stores from "./store/configureStore";
import "./styles/app.global.css";

const { configureStore, history } = stores.default;
const store = configureStore();

dbConfig();

render(
	<AppContainer>
		<App store={store} history={history} />
	</AppContainer>,
	document.getElementById("root")
);

if (module.hot) {
	module.hot.accept("./containers/App", () => {
		const NextApp = require("./containers/App");
		render(
			<AppContainer>
				<NextApp store={store} history={history} />
			</AppContainer>,
			document.getElementById("root")
		);
	});
}
