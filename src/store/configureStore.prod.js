import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createHashHistory } from "history";
import { routerActions } from "react-router-redux";
import rootReducer from "../reducers";

const history = createHashHistory();
const actionCreators = {
	...routerActions
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			actionCreators
	  })
	: compose;
const enhancers = [applyMiddleware(thunk)];
const enhancer = composeEnhancers(...enhancers);

function configureStore(initialState) {
	return createStore(rootReducer(history), initialState, enhancer);
}

export default { configureStore, history };
