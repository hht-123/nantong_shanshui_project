import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
//import history from '../components/common/history';

import Footer from '../components/common/Footer';



class MRoute extends Component {
  render() {
    return (
      <Router >
        <Switch>
          <Route exact path="/" component={Footer} />
          
        </Switch>
      </Router>
    );
  }
}

export default MRoute;