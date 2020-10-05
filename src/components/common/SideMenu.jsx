import React, {Component} from "react";
import { Menu, Icon } from 'antd';
// import { Link } from "react-router-dom";

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
        <SubMenu
          key="sub1"
          title={
            <span>
                  <Icon type="user" />
                  subnav 1
                </span>
          }
        >
          <Menu.Item key="1">option1</Menu.Item>
          <Menu.Item key="2">option2</Menu.Item>
          <Menu.Item key="3">option3</Menu.Item>
          <Menu.Item key="4">option4</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
                  <Icon type="laptop" />
                  subnav 2
                </span>
          }
        >
          {/*<Link to="/technology-system/check/sample-frame">样架测量检验</Link>*/}
          <Menu.Item key="5">option5</Menu.Item>
          <Menu.Item key="6">option6</Menu.Item>
          <Menu.Item key="7">option7</Menu.Item>
          <Menu.Item key="8">option8</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub3"
          title={
            <span>
                  <Icon type="notification" />
                  subnav 3
                </span>
          }
        >
          <Menu.Item key="9">option9</Menu.Item>
          <Menu.Item key="10">option10</Menu.Item>
          <Menu.Item key="11">option11</Menu.Item>
          <Menu.Item key="12">option12</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}
