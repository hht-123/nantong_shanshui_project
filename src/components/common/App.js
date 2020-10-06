import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import { getCookie, setCookie } from "../../helpers/cookies";
import store from '../../store';
import { Provider } from 'react-redux';

import EngineInfo from '../../views/basicInfo/engineInfo'
import SideMenu from './SideMenu';
import HeaderCustom from './HeaderCustom';
import Index from '../index/index';
// import noMatch from './404';

import MaintenanceIndex from '../../views/maintenance/index';
import MessageCuster from '../../views/Message/MessageCuster';
import '../../style/index.less';


const { Content, Footer, Sider } = Layout;

class App extends Component {
  state = {
    collapsed: getCookie("mspa_SiderCollapsed") === "true",
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    }, function () {
      setCookie("mspa_SiderCollapsed", this.state.collapsed);
    });
  };

  componentDidMount() {
    if (getCookie("mspa_SiderCollapsed") === null) {
      setCookie("mspa_SiderCollapsed", false);
    }
  }

  render() {
    const { collapsed } = this.state;
    // const {location} = this.props;
    let name;
    // if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
    //   return <Redirect to="/login" />
    // } else {
    //   name = JSON.parse(getCookie("mspa_user")).username;
    // }
    return (
      <Layout>
        <Provider store={store}>
          <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name} />
          <Content>
            {/*<HeaderMenu />*/}
            <Layout style={{ padding: '0 0', background: '#F8FAFF' }}>
              <Sider width={200} style={{ background: '#fff' }}>
                <SideMenu />
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 'calc(100vh - 111px)' }}>
                <Switch>
                  <Route exact path={'/'} component={(props) =><Index {...props}/>} />
                  <Route path='/app/engine' component={EngineInfo} />
                  <Route path='/app/maintenance' component={MaintenanceIndex} />
                  <Route path='/app/message' component={MessageCuster} />
                </Switch>
              </Content>
            </Layout>
          </Content>

          <Footer style={{ textAlign: 'center', backgroundColor: "#778899", color: "white" }}>
            <span style={{ display: "block" }}>公司地址：上海市杨浦区军工路516号上海理工大学</span>
            <span style={{ display: "block" }}>联系电话：12345</span>
            <span style={{ display: "block" }}>邮箱：12345@qq.com</span>
          </Footer>
        </Provider>
      </Layout>
    )
  }
}

export default withRouter(App);
