import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { getCookie, setCookie } from "../../helpers/cookies";
import store from '../../store'
import { Provider } from 'react-redux';
import '../../style/index.less';
import { Model } from '../../dataModule/testBone';

import SideMenu from './SideMenu';
import HeaderCustom from './HeaderCustom';
// import noMatch from './404';
import PumpInfo from '../../views/basicInfo/pumpsinfo'
import EngineInfo from '../../views/basicInfo/engineInfo';
import SensorInfo from '../../views/basicInfo/sensorInfo';
import EpuipmentInfo from '../../views/fixedAssets/equipmentInfo';
import MaintenanceIndex from '../../views/maintenance/index';
import MessageIndex from '../../views/Message/MesCustomer/MessageIndex';
import ContactIndex from '../../views/Message/ContactMes/ContactIndex';

import '../../style/index.less';
import Monitor from '../../views/maintenance/monitor';
//import { connect } from 'react-redux';
//import { actionCreators } from '../index/store';
import EquipmentMaintenance from '../../views/maintenance/equipmentMaintenance/equipmentMaintenance';
// import WaterRemind from '../../views/maintenance/waterRemind/waterRemind';
import SensorCalibration from '../../views/maintenance/sensorCalibration/sensorCalibration';
import EquipmentOprationRecord from '../../views/maintenance/equipmentOperationRecord/index'

import PumpPower from '../../views/accountAndRole/PumpPower/index'
import RolePower from '../../views/accountAndRole/rolePower'
import equipmentScrap from '../../views/fixedAssets/equipmentScrap';
import EpuipmentConfigure from '../../views/fixedAssets/equipmentConfigure';
import EpuipmentAllocation from '../../views/fixedAssets/equipmentAllocation';

// 配置流程
import EpuipmentProInfo from '../../views/basicInfo/equipmentProcess/index'

//客户端页面
import  ClientIndex  from '../../views/ClientViews/index/index.js';
import ClientMonitor from '../../views/ClientViews/monitor/monitor';
import ClientWaterRemind from '../../views/ClientViews/waterRemind/waterRemind';
import ClientEquipMaintenance from '../../views/ClientViews/equipmentMaintenance/index.js'
import ClientSensorCalibration from '../../views/ClientViews/sensorCalibration/index';

import AccountManagement from '../../views/accountAndRole/accountManagement'

import { actionCreators as indexActionCreators } from '../index/store';
import {verifyUrl} from '../../dataModule/UrlList';
import { getUserId, getRoleId } from '../../publicFunction/index';

const model = new Model();
const { Content, Footer, Sider } = Layout;

class App extends Component {verifyUrl
  state = {
    collapsed: getCookie("mspa_SiderCollapsed") === "true",
    roleData: []
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
    store.dispatch(indexActionCreators.getSensorType())   //获取所有传感器的类型
    store.dispatch(indexActionCreators.getRoleData())
    this.getRoleData()
  }

  getRoleData() {
    const me = this
    model.fetch(
      {'user_id': getUserId(), 'role_id': getRoleId()},
      verifyUrl,
      'get',
      function(response) {
        if(response.data.power_num.includes('client_manage') === false ) {
          me.setState({
            visible: false
          })
        }
        me.setState({
          roleData: response.data.power_num
        })
      },
      function() {
        console.log('失败'); //失败信息
      },
    )
  }

  render() {
    const { collapsed, roleData } = this.state
    // const {location} = this.props;
    let name, role_id ;
    if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
      return <Redirect to="/login" />
    } else {
      name = JSON.parse(getCookie("mspa_user")).username;
      role_id = JSON.parse(getCookie("mspa_user")).role_id
    }
    if (this.state.roleData === undefined) return null
    let maintenanceUrl = [
      <Route path='/app/maintenance' key='maintenance' component={MaintenanceIndex} />,
      <Route path='/app/monitor/:equipment_aid' key='monitor' component={(props) => <Monitor {...props}/>} />,
      <Route path='/app/equipmentMaintenance/:equipment_id' key='equipmentMaintenance' component={EquipmentMaintenance} />,
      // <Route path='/app/waterRemind/:equipment_id' key='waterRemind' component={WaterRemind} />,
      <Route path='/app/waterRemind/:equipment_id' key='waterRemind' component={ClientWaterRemind} />,
      <Route path='/app/sensorCalibratin/:equipment_id' key='sensorCalibratin' component={SensorCalibration} />,
      <Route path='/app/EquipmentOprationRecord/:equipment_id' key='EquipmentOprationRecord' component={(props) => <EquipmentOprationRecord {...props}/>} />
    ]

    
    
    
    return (
      <Layout>
        <Provider store={store}>
          <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name} />
          <Content>
            {/*<HeaderMenu />*/}
            <Layout style={{ padding: '0 0', background: '#F8FAFF' }}>
              {/* <Sider width={200} style={{ background: '#fff' }} hidden={this.state.roleData.includes('client_manage')} > */}
              <Sider width={200} style={{ background: '#fff' }} hidden={role_id === '9ca9088b74694db5a1b4594bcb8b2912' ? true : false}>
                <SideMenu roleData={roleData} />
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 'calc(100vh - 111px)' }}>
                <Switch>
                  <Route path='/app/equipmentProcess' component={(props) => <EpuipmentProInfo {...props} />} />,
                  { Array.from(roleData).map((item,index) => {
                    if(item === 'equipment_maintenance_retrieve') {
                      return [<Route exact path='/app' component={ MaintenanceIndex} />,
                            <Route path='/app/equipment' component={(props) => <EpuipmentInfo {...props} />} />,
                            <Route path='/app/equipmentScrap' component={equipmentScrap} />,
                            <Route path='/app/EpuipmentConfigure' component={EpuipmentConfigure} />,
                            <Route path='/app/EpuipmentAllocation' component={EpuipmentAllocation} />,
                    ]
                    }else if( item === 'client_message_retrieve') {
                      return [<Route exact path='/app' component={ MaintenanceIndex} />,
                              <Route path='/app/message' component={(props) => <MessageIndex {...props} />} />,
                              <Route path='/app/contact/:client_id' component={ContactIndex} />,
                      ]
                    }else if( item === 'pump_information_view') {
                      return [<Route exact path='/app' component={ MaintenanceIndex} />,
                              <Route path='/app/pumps' component={(props) => <PumpInfo {...props} />} />,
                      ]
                    }else if( item === 'engine_message_retrieve') {
                      return [
                        <Route exact path='/app' component={ MaintenanceIndex} />,
                        <Route path='/app/engine' component={EngineInfo} />,
                      ]
                    }else if( item === 'sensor_message_retrieve') {
                      return [
                        <Route exact path='/app' component={ MaintenanceIndex} />,
                        <Route path='/app/sensor' component={(props) => <SensorInfo {...props} />} />,
                    ]
                    }else if( item === 'client_manage') {
                      return [
                        <Route path='/app/clientIndex' component={ClientIndex} />,
                        <Route path='/app/clientMonitor/:equipment_aid' component={(props) => <ClientMonitor {...props}/>} />,
                        <Route path='/app/clientWaterRemind/:equipment_id' component={ClientWaterRemind} />,
                        <Route path='/app/clientEquipMaintenace/:equipment_id' component={ClientEquipMaintenance} />,
                        <Route path='/app/clientSensorCalibration/:equipment_id' component={ClientSensorCalibration} />,
                        <Route path='/app/EquipmentOprationRecord/:equipment_id' key='EquipmentOprationRecord' component={(props) => <EquipmentOprationRecord {...props}/>} />
                      ]
                    }else if( item === 'role_permissions_retrieve') {
                      return [<Route path='/app/rolePower' component={RolePower}/>]
                    }else if( item === 'account_management') {
                      return [
                      <Route path='/app/accountManagement' component={AccountManagement}/>,
                      <Route path='/app/pumpsPower' component={(props) => <PumpPower {...props} />} />
                      ]
                    } 
                    return null;
                  })}

                  {/* <Route exact path='/app' component={this.state.roleData.includes('client_manage') ? ClientIndex : MaintenanceIndex} /> */}
    
                  { this.state.roleData.includes('client_manage') ? null : maintenanceUrl }
                  {/* <Route path='/app/engine' component={EngineInfo} /> */}
                  {/* <Route path='/app/maintenance' component={MaintenanceIndex} /> */}
                  {/* <Route path='/app/message' component={(props) => <MessageIndex {...props}/>} /> */}
                  {/* <Route path='/app/monitor/:equipment_aid' component={Monitor} /> */}
                  {/* <Route path='/app/sensor' component={(props) =><SensorInfo {...props}/>} /> */}
                  {/* <Route path='/app/equipmentMaintenance/:equipment_id' component={EquipmentMaintenance} /> */}
                  {/* <Route path='/app/contact/:client_id' component={ContactIndex} /> */}
                  {/* <Route path='/app/equipment' component={(props) => <EpuipmentInfo {...props}/>} /> */}
                  {/* <Route path='/app/waterRemind/:equipment_id' component={WaterRemind} />
                  <Route path='/app/sensorCalibratin/:equipment_id' component={SensorCalibration} /> */}
                  {/* <Route path='/app/equipmentScrap' component={equipmentScrap} />
                  <Route path='/app/EpuipmentConfigure' component={EpuipmentConfigure} />
                  <Route path='/app/EpuipmentAllocation' component={EpuipmentAllocation} /> */}
                  {/* 客户端页面路由 */}
                  {/* <Route path='/app/clientIndex' component={ClientIndex} />
                  <Route path='/app/clientMonitor/:equipment_aid' component={ClientMonitor} />
                  <Route path='/app/clientWaterRemind/:equipment_id' component={ClientWaterRemind} />
                  <Route path='/app/clientEquipMaintenace/:equipment_id' component={ClientEquipMaintenance} />
                  <Route path='/app/clientSensorCalibration/:equipment_id' component={ClientSensorCalibration} /> */}
                 
                  {/* <Route path='/app/accountManagement' component={AccountManagement}/> */}
                  {/* <Route path='/app/rolePower' component={RolePower}/> */}

                </Switch>
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center', backgroundColor: "#778899", color: "white" }}>
            <span style={{ display: "block" }}>公司地址：南通善水化工</span>
            <span style={{ display: "block" }}>联系电话：12345</span>
            <span style={{ display: "block" }}>邮箱：12345@qq.com</span>
          </Footer>
        </Provider>
      </Layout>
    )
  }
}

export default withRouter(App);
