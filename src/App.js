import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import logo from './logo.svg';
import './App.css';
import Login from './component/Login';
import Setup from './component/Setup';
import Otp from './component/Otp';

class App extends Component {
  render() {
    return (
      <Router>
        <Route
          render={({location}) => (
          <Switch location={location}>
            <Route exact path="/" component={Login}/>
            <Route path="/setup" component={Setup}/>
            <Route path="/otp" component={Otp}/>
          </Switch>
        )}/>
      </Router>
    );
  }
}

export default App;
