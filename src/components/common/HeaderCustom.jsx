import React, { Component } from 'react';
import { Layout, Menu, } from 'antd';
import history from './history';
import { removeCookie } from "../../helpers/cookies";
import { withRouter } from 'react-router-dom';
// import { Link } from "react-router-dom";

import '../../style/header.less';
import logo from '../../statistics/logo.png';
import { nowTime } from '../../publicFunction/index';
// import { setCookie } from "../../helpers/cookies";
// import {color} from "echarts/src/export";

const { Header } = Layout;

class HeaderCustom extends Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed,
            date: nowTime(),
        }
        this.logout = this.logout.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
    }

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
        });
    };

    logout = () => {
        // 删除登陆信息，并跳转页面
        removeCookie("mspa_user");
        history.push('/login');
    };

    //setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: nowTime()
        });
    }

    render(){
      const menu_property = (
        <Menu>
          <Menu.Item >设备信息</Menu.Item>
          <Menu.Item >设备配置记录</Menu.Item>
          <Menu.Item >设备调拨</Menu.Item>
          <Menu.Item >设备调拨记录</Menu.Item>
          <Menu.Item >设备报废</Menu.Item>
        </Menu>
      );

      const menu_information = (
        <Menu>
          <Menu.Item >主机信息</Menu.Item>
          <Menu.Item >传感器信息</Menu.Item>
          <Menu.Item >客户信息</Menu.Item>
        </Menu>
      );

      return(
        <Header className="header-style header">
          <img alt="logo" src={logo}/>
          {/* <Link to="/technology-system"> */}
            <span className={'header-span'}>循环水智慧管家远程监控系统</span>
          {/* </Link> */}
          {/* <span className="date-span">{this.state.date.toLocaleString()}</span> */}
          
        </Header>
      )
    }
}

export default withRouter(HeaderCustom)
