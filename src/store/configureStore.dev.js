import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createHashHistory } from "history";
import { routerActions } from "react-router-redux";
import { createLogger } from "redux-logger";
import rootReducer from "../reducers";

const history = createHashHistory();

const configureStore = initialState => {
	const middleware = [];
	const enhancers = [];

	middleware.push(thunk);

	const logger = createLogger({
		level: "info",
		collapsed: true
	});

	if (process.env.NODE_ENV !== "test") {
		middleware.push(logger);
	}

	const actionCreators = {
		...routerActions
	};
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
				actionCreators
		  })
		: compose;

	enhancers.push(applyMiddleware(...middleware));
	const enhancer = composeEnhancers(...enhancers);

	const store = createStore(rootReducer(history), initialState, enhancer);

	if (module.hot) {
		module.hot.accept("../reducers", () => store.replaceReducer(require("../reducers")));
	}

	return store;
};

export default { configureStore, history };
