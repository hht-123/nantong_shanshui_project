import React, { Component } from 'react';
//import {  Icon, Dropdown, menu } from 'antd';
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";

import logo from '../../statistics/logo.png';


class Header extends Component{
    render(){
        return(
            <Header className="header-style header">
                <img alt="logo" src={logo}/>
                <Link to="/technology-system">
                    <span className={'header-span'}>循环水智慧管家远程监控系统</span>
                </Link>
                
            </Header>
        )
    }
}

export default withRouter(Header);