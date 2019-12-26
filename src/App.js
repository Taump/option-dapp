import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'antd/dist/antd.css';
import store from './store';
import Main from './pages/Main/Main';
import Deploy from './pages/Deploy/Deploy';
import Settings from './pages/Settings/Settings';
import { UpdateActiveAA } from './components/UpdateActiveAA/UpdateActiveAA'
const App = () => (
  <Provider store={store}>
    <UpdateActiveAA>
      <Router>
        <Route exact path="/">
          <Main />
        </Route>
        <Route exact path="/add/:AA">
          <Main />
        </Route>
        <Route exact path="/deploy">
          <Deploy />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
      </Router>
    </UpdateActiveAA>
  </Provider>
);


export default App;
