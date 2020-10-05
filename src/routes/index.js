/*
 * @Descripttion:
 * @version:
 * @Author: 唐帆
 * @Date: 2020-03-09 18:54:38
 * @LastEditors: 唐帆
 * @LastEditTime: 2020-04-30 10:07:41
 */
import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../components/common/history';

import App from '../components/common/App';
import Login from '../components/common/Login';
import Home from '../components/common/Home';
import NoMatch from '../components/common/404';


class MRoute extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          {/* <Route exact path="/" component={Home} /> */}
          <Route path="/app" component={App} />
          {/* <Route path="/login" component={Login} />
          <Route component={NoMatch} /> */}
        </Switch>
      </Router>   
    );
  }
}

export default MRoute;
