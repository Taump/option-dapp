import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'antd/dist/antd.css';
import store from './store';
import Main from './pages/Main/Main';
import Deploy from './pages/Deploy/Deploy';


const App = ({ client, isValidAddress }) => {
  return (
    <Provider store={store}>
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
      </Router>
    </Provider>
  )

};


export default App;
