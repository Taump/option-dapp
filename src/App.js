import React from "react";
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";

import store from "./store";

import "antd/dist/antd.css";

import MainPage from "./pages/MainPage/MainPage";
import DeployPage from "./pages/DeployPage/DeployPage";
import IssuingAssetsPage from "./pages/IssuingAssetsPage/IssuingAssetsPage";
import SearchPage from "./pages/SearchPage/SearchPage";

import { WatcherUpdate } from "./components/WatcherUpdate/WatcherUpdate";
import { InnerRoute } from "./components/InnerRoute/InnerRoute";
import history from "./history";
const App = () => {
  return (
    <Provider store={store}>
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
          <Route exact path="/issuing_assets">
            <IssuingAssetsPage />
          </Route>
        </Router>
      </WatcherUpdate>
    </Provider>
  );
};

export default App;
