import React from "react";
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import configureStore from "./store";
import "antd/dist/antd.css";
import history from "./history";

import MainPage from "./pages/MainPage/MainPage";
import DeployPage from "./pages/DeployPage/DeployPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import { WatcherUpdate } from "./components/WatcherUpdate/WatcherUpdate";
import { InnerRoute } from "./components/InnerRoute/InnerRoute";

const { persistor, store } = configureStore();
const App = () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<WatcherUpdate>
					<Router history={history}>
						<Route exact path="/">
							<InnerRoute>
								<MainPage />
							</InnerRoute>
						</Route>
						<Route exact path="/deploy">
							<DeployPage />
						</Route>
						<Route exact path="/search">
							<SearchPage />
						</Route>
						<Route exact path="/about">
							<AboutPage />
						</Route>
					</Router>
				</WatcherUpdate>
			</PersistGate>
		</Provider>
	);
};

export default App;
