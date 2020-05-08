import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { aaReducer } from "./reducers/aa";
import { deployReducer } from "./reducers/deploy";
import { assetsReducer } from "./reducers/assets";
import { symbolsRegReducer } from "./reducers/symbolsReg";
import { recentReducer } from "./reducers/recent";

const rootReducer = combineReducers({
	aa: aaReducer,
	deploy: deployReducer,
	assets: assetsReducer,
	symbolsReg: symbolsRegReducer,
	recent: recentReducer
});

const persistConfig = {
	key: "prediction",
	storage,
	whitelist: ["assets", "recent"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
	const store = createStore(
		persistedReducer,
		compose(
			applyMiddleware(thunk),
			window.__REDUX_DEVTOOLS_EXTENSION__
				? window.__REDUX_DEVTOOLS_EXTENSION__()
				: f => f
		)
	);
	return { store, persistor: persistStore(store) };
};
