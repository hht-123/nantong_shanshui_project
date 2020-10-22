import React, {Component} from "react";
import { Tabs } from 'antd';

import PowerTreeComponent from './powerTreeComponent'
import {originalUrl, power, rolePower} from "../../../dataModule/UrlList";
import { Model } from '../../../dataModule/testBone'

const { TabPane } = Tabs;
const model = new Model();

export default class RolePower extends Component {
  state = {
    maintainEquipment: [],
    equipmentManagement: [],
    client: [],
    clientManager: [],
    powers: []
  }

  componentDidMount() {
    const me = this
    this.queryOfPower()
    this.queryRolePower({"role_id": "3b9fd7c3e5ea400e9813fcc5bf5d1a4b"}, function (res) {
      me.setState({
        maintainEquipment: res.data.data
      })
    })
    this.queryRolePower({"role_id": "8c6ae9e782de464eadcc497268e07d4f"}, function (res) {
      me.setState({
        equipmentManagement: res.data.data
      })
    })
    this.queryRolePower({"role_id": "9ca9088b74694db5a1b4594bcb8b2912"}, function (res) {
      me.setState({
        client: res.data.data
      })
    })
    this.queryRolePower({"role_id": "a9b1c233089148ba8ee80704d6b61221"}, function (res) {
      me.setState({
        clientManager: res.data.data
      })
    })
  }

  queryRolePower = (params, thenFunction) => {
    const me = this
    model.fetch(
      params,
      originalUrl + rolePower,
      'get',
      thenFunction
    )
  }

  queryOfPower = (params={}, methods='get', thenFunction) => {
    const me = this
    model.fetch(
      {
        ...params
      },
      originalUrl + power,
      methods,
      function (res) {
        me.setState({
          powers: res.data
        })
      }
    )
  }

  callback = (key) => {
  }

  render() {
    const {powers, maintainEquipment, equipmentManagement, clientManager, client} = this.state

    return (
      <div className="account-root">
        <div className='name'>角色权限：</div>
        <div className='wrapper'>
          <Tabs defaultActiveKey="设备维护" onChange={this.callback}>
            <TabPane tab="设备维护" key="设备维护">
              <PowerTreeComponent powers={powers} rolePowers={maintainEquipment}/>
            </TabPane>
            <TabPane tab="设备管理" key="设备管理">
              <PowerTreeComponent powers={powers} rolePowers={equipmentManagement}/>
            </TabPane>
            <TabPane tab="客户经理" key="客户经理">
              <PowerTreeComponent powers={powers} rolePowers={clientManager}/>
            </TabPane>
            <TabPane tab="客户" key="客户">
              <PowerTreeComponent powers={powers} rolePowers={client}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
