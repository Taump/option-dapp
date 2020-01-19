import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "antd/dist/antd.css";
import store from "./store";
import Main from "./pages/Main/Main";
import Deploy from "./pages/Deploy/Deploy";
import IssuingAssets from "./pages/IssuingAssets/IssuingAssets";
import Search from "./pages/Search/Search";
import { WatcherUpdate } from "./components/WatcherUpdate/WatcherUpdate";
import { InnerRoute } from "./components/InnerRoute/InnerRoute";

const App = () => {
  return (
    <Provider store={store}>
      <WatcherUpdate>
        <Router>
          <Route exact path="/">
            <InnerRoute>
              <Main />
            </InnerRoute>
          </Route>
          <Route exact path="/deploy">
            <Deploy />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/issuing_assets">
            <IssuingAssets />
          </Route>
        </Router>
      </WatcherUpdate>
    </Provider>
  );
};

export default App;
