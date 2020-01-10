import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "antd/dist/antd.css";
import store from "./store";
import Main from "./pages/Main/Main";
import Deploy from "./pages/Deploy/Deploy";
import IssuingAssets from "./pages/IssuingAssets/IssuingAssets";
import Search from "./pages/Search/Search";
import { UpdateActiveAA } from "./components/UpdateActiveAA/UpdateActiveAA";
import Notifications from "./pages/Notifications/Notifications";
const App = () => (
  <Provider store={store}>
    <UpdateActiveAA>
      <Router>
        <Route exact path="/">
          <Main />
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
        <Route exact path="/notifications">
          <Notifications />
        </Route>
      </Router>
    </UpdateActiveAA>
  </Provider>
);

export default App;
