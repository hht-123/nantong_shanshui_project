import React, { Component } from 'react';
import { Layout } from 'antd';
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

      return(
        <Header className="header-style header">
          <img alt="logo" src={logo}/>
            <span className={'header-span'}>循环水智慧管家远程监控系统</span>
        </Header>
      )
    }
}

export default withRouter(HeaderCustom)