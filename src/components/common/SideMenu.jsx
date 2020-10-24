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
          <Menu.Item key="5"><Link to="/app/EpuipmentConfigure">设备配置记录</Link></Menu.Item>
          <Menu.Item key="7"><Link to="/app/EpuipmentAllocation">设备调拨记录</Link></Menu.Item>
          <Menu.Item key="8"><Link to="/app/equipmentScrap">设备报废记录</Link></Menu.Item>
        </SubMenu>
        <SubMenu
          key="accountAndRole"
          title={
            <span>
              <Icon type="ordered-list" />
              账户与权限
            </span>
          }>
          <Menu.Item key="account"><Link to='/app/accountManagement'>账户管理</Link></Menu.Item>
          <Menu.Item key="role"><Link to='/app/rolePower'>角色权限</Link></Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}
