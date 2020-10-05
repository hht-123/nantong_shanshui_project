import React, {Component} from "react";
import { Menu, Icon } from 'antd';
import { Link } from "react-router-dom";

import { getUserName } from '../../publicFunction';
import history from './history';

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
        <SubMenu
          key="sub1"
          title={
            <span>
                  <Icon type="user" />
                  运维
                </span>
          }
        >
          {/* <Menu.Item key="1">option1</Menu.Item>
          <Menu.Item key="2">option2</Menu.Item>
          <Menu.Item key="3">option3</Menu.Item>
          <Menu.Item key="4">option4</Menu.Item> */}
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
                  <Icon type="laptop"/>
                  基本信息
                </span>
          }
        >
          {/*<Link to="/technology-system/check/sample-frame">样架测量检验</Link>*/}
          <Menu.Item key="1">主机信息</Menu.Item>
          <Menu.Item key="2">传感器信息</Menu.Item>
          <Menu.Item key="3">客户信息</Menu.Item>
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
          <Menu.Item key="4">设备信息</Menu.Item>
          <Menu.Item key="5">设备配置记录</Menu.Item>
          <Menu.Item key="6">设备调拨</Menu.Item>
          <Menu.Item key="7">设备调拨记录</Menu.Item>
          <Menu.Item key="8">设备报废</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}
