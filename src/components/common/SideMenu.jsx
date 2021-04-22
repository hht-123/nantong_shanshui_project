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
    if (this.props.roleData === undefined ) return null
    // let list = []
    // for (let i=0; i<this.props.roleData.length; i++) {
    //   if(this.props.roleData[i] === 'role_permissions_retrieve' || this.props.roleData[i] === 'account_management') {
        
    //   }
    // }
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
          <Menu.Item key="engine"><Link to='/app/engine'>主机信息</Link></Menu.Item>
          <Menu.Item key="sensor"><Link to='/app/sensor'>传感器信息</Link></Menu.Item>
          <Menu.Item key="pumps"><Link to='/app/pumps'>控制泵信息</Link></Menu.Item>
          <Menu.Item key="message"><Link to="/app/message">客户信息</Link></Menu.Item>
          <Menu.Item key="equipment"><Link to="/app/equipment">设备信息</Link></Menu.Item>
          <Menu.Item key="equipmentProcess"><Link to="/app/equipmentProcess">设备创建配置流程</Link></Menu.Item>
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
          {/* <Menu.Item key="4"><Link to="/app/equipment">设备信息</Link></Menu.Item> */}
          <Menu.Item key="EpuipmentConfigure"><Link to="/app/EpuipmentConfigure">设备配置记录</Link></Menu.Item>
          <Menu.Item key="EpuipmentAllocation"><Link to="/app/EpuipmentAllocation">设备调拨记录</Link></Menu.Item>
          <Menu.Item key="equipmentScrap"><Link to="/app/equipmentScrap">设备报废记录</Link></Menu.Item>
        </SubMenu>
        {/* { Array.from(this.props.roleData).map((item,index) => {
          if (item === 'role_permissions_retrieve' || item === 'account_management' ) {
                  return   <SubMenu
                      key="accountAndRole"
                      title={
                        <span>
                          <Icon type="ordered-list" />
                          账户与权限
                        </span>
                      }>
                    { Array.from(this.props.roleData).map((item,index) => {
                      if ( item === 'role_permissions_retrieve') {
                        return  <Menu.Item key="role"><Link to='/app/rolePower'>角色权限</Link></Menu.Item>                  
                      } else if (item === 'account_management') {
                        return  <Menu.Item key="account"><Link to='/app/accountManagement'>账户管理</Link></Menu.Item>
                      }
                    })}
                    </SubMenu>
                    }
        })} */}

        <SubMenu
          key="accountAndRole"
          title={
            <span>
              <Icon type="ordered-list" />
              账户与权限
            </span>
          }
          hidden = { this.props.roleData.includes('role_permissions_retrieve')||this.props.roleData.includes('account_management') ? false : true}
          >
        { Array.from(this.props.roleData).map((item,index) => {
          if ( item === 'role_permissions_retrieve') {
            return  <Menu.Item key="role"><Link to='/app/rolePower'>角色权限</Link></Menu.Item>                  
          } else if (item === 'account_management') {
            return  <Menu.Item key="account"><Link to='/app/accountManagement'>账户管理</Link></Menu.Item>
          }
          return true
        })}
         <Menu.Item key="pupmPower"><Link to="/app/pumpsPower">泵的权限</Link></Menu.Item>
        </SubMenu> 
        {/* <SubMenu
          key="accountAndRole"
          title={
            <span>
              <Icon type="ordered-list" />
              账户与权限
            </span>
          }>
          <Menu.Item key="account"><Link to='/app/accountManagement'>账户管理</Link></Menu.Item>
          <Menu.Item key="role"><Link to='/app/rolePower'>角色权限</Link></Menu.Item>
        </SubMenu> */}
      </Menu>
    );
  }
}
