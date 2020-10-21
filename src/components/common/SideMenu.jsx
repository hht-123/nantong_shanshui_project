import React, {Component} from "react";
import { Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';


// import { getUserName } from '../../publicFunction';
// import history from './history';

const { SubMenu } = Menu;

export default class SideMenu extends Component {
  state = {
    current: 'mail',
  };

  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <Menu
        mode="inline"
        style={{ height: 'calc(100% - 3rem)', marginTop: '3rem' }}
      >
        
        <Menu.Item key="0">
            <Link to="/app/maintenance">
              <Icon type="pie-chart" />
              <span>运维</span>
            </Link>
          </Menu.Item>

        <SubMenu
          key="sub2"
          title={
            <span>
                  <Icon type="laptop"/>
                  基本信息
                </span>
          }
        >
          <Menu.Item key="1"><Link to='/app/engine'>主机信息</Link></Menu.Item>
          <Menu.Item key="2"><Link to='/app/sensor'>传感器信息</Link></Menu.Item> 
          <Menu.Item key="3"><Link to="/app/message">客户信息</Link></Menu.Item>
          
        </SubMenu>
        <SubMenu
          key="sub3"
          title={
            <span>
                  <Icon type="notification" />
                  固定资产
                </span>
          }
        >
          <Menu.Item key="4"><Link to="/app/equipment">设备信息</Link></Menu.Item>
          <Menu.Item key="5">设备配置记录</Menu.Item>
          <Menu.Item key="6">设备调拨信息</Menu.Item>
          <Menu.Item key="7">设备调拨记录</Menu.Item>
          <Menu.Item key="8">设备报废信息</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}