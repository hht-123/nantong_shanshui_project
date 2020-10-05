import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
//import history from '../components/common/history';

import Footer from '../components/common/Footer';

<<<<<<< HEAD
=======
import App from '../components/common/App';
// import Login from '../components/common/Login';
// import Home from '../components/common/Home';
// import NoMatch from '../components/common/404';
>>>>>>> 509d0707df4fdabec4a77c3ffd6a38fff531dc0b


class MRoute extends Component {
  render() {
    return (
      <Router >
        <Switch>
<<<<<<< HEAD
          <Route exact path="/" component={Footer} />
          
=======
          <Route path="/app" component={App} />
          {/* <Route path="/app" component={App} />
          <Route path="/login" component={Login} />
          <Route component={NoMatch} /> */}
>>>>>>> 509d0707df4fdabec4a77c3ffd6a38fff531dc0b
        </Switch>
      </Router>
    );
  }
}

export default MRoute;