import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { getCookie, setCookie } from "../../helpers/cookies";
import store from '../../store'
import { Provider } from 'react-redux';
import '../../style/index.less';

import SideMenu from './SideMenu';
import HeaderCustom from './HeaderCustom';
import Index from '../index/index';
// import noMatch from './404';
import EngineInfo from '../../views/basicInfo/engineInfo';
import SensorInfo from '../../views/basicInfo/sensorInfo';
import EpuipmentInfo from '../../views/fixedAssets/equipmentInfo';
import MaintenanceIndex from '../../views/maintenance/index';
import MessageIndex from '../../views/Message/MesCustomer/MessageIndex';
import ContactIndex from '../../views/Message/ContactMes/ContactIndex';

import '../../style/index.less';
import Monitor from '../../views/maintenance/monitor';
//import { connect } from 'react-redux';
//import { Model } from '../../dataModule/testBone';
//import { actionCreators } from '../index/store';
import EquipmentMaintenance from '../../views/maintenance/equipmentMaintenance/equipmentMaintenance';
import WaterRemind from '../../views/maintenance/waterRemind/waterRemind';
import SensorCalibration from '../../views/maintenance/sensorCalibration/sensorCalibration';
import RolePower from '../../views/accountAndRole/rolePower'
import equipmentScrap from '../../views/fixedAssets/equipmentScrap';
import EpuipmentConfigure from '../../views/fixedAssets/equipmentConfigure';
import EpuipmentAllocation from '../../views/fixedAssets/equipmentAllocation';

//客户端页面
import  ClientIndex  from '../../views/ClientViews/index/index.js';
import ClientMonitor from '../../views/ClientViews/monitor/monitor';
import ClientWaterRemind from '../../views/ClientViews/waterRemind/waterRemind';
import ClientEquipMaintenance from '../../views/ClientViews/equipmentMaintenance/index.js'
import ClientSensorCalibration from '../../views/ClientViews/sensorCalibration/index';

import AccountManagement from '../../views/accountAndRole/accountManagement'

import { actionCreators as indexActionCreators } from '../index/store';

//const model = new Model();

const { Content, Footer, Sider } = Layout;

class App extends Component {
  state = {
    collapsed: getCookie("mspa_SiderCollapsed") === "true",
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
  }

  render() {
    const { collapsed } = this.state;
    // const {location} = this.props;
    let name;
    if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
      return <Redirect to="/login" />
    } else {
      name = JSON.parse(getCookie("mspa_user")).username;
    }
    return (
      <Layout>
        <Provider store={store}>
          <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name} />
          <Content>
            {/*<HeaderMenu />*/}
            <Layout style={{ padding: '0 0', background: '#F8FAFF' }}>
              <Sider width={200} style={{ background: '#fff' }}>
                <SideMenu />
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 'calc(100vh - 111px)' }}>
                <Switch>
                  <Route exact path='/app' component={(props) =><Index {...props}/>} />
                  <Route path='/app/engine' component={EngineInfo} />
                  <Route path='/app/maintenance' component={MaintenanceIndex} />
                  <Route path='/app/message' component={MessageIndex} />
                  <Route path='/app/monitor/:equipment_aid' component={Monitor} />
                  <Route path='/app/sensor' component={(props) =><SensorInfo {...props}/>} />
                  <Route path='/app/equipmentMaintenance/:equipment_id' component={EquipmentMaintenance} />
                  <Route path='/app/contact/:client_id' component={ContactIndex} />
                  <Route path='/app/equipment' component={(props) => <EpuipmentInfo {...props}/>} />
                  <Route path='/app/waterRemind/:equipment_id' component={WaterRemind} />
                  <Route path='/app/sensorCalibratin/:equipment_id' component={SensorCalibration} />
                  <Route path='/app/equipmentScrap' component={equipmentScrap} />
                  <Route path='/app/EpuipmentConfigure' component={EpuipmentConfigure} />
                  <Route path='/app/EpuipmentAllocation' component={EpuipmentAllocation} />
                  {/* 客户端页面路由 */}
                  <Route path='/app/clientIndex' component={ClientIndex} />
                  <Route path='/app/clientMonitor/:equipment_aid' component={ClientMonitor} />
                  <Route path='/app/clientWaterRemind/:equipment_id' component={ClientWaterRemind} />
                  <Route path='/app/clientEquipMaintenace/:equipment_id' component={ClientEquipMaintenance} />
                  <Route path='/app/clientSensorCalibration/:equipment_id' component={ClientSensorCalibration} />
                 
                  <Route path='/app/accountManagement' component={AccountManagement}/>
                  <Route path='/app/rolePower' component={RolePower}/>

                </Switch>
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center', backgroundColor: "#778899", color: "white" }}>
            <span style={{ display: "block" }}>公司地址：上海市杨浦区军工路516号上海理工大学</span>
            <span style={{ display: "block" }}>联系电话：12345</span>
            <span style={{ display: "block" }}>邮箱：12345@qq.com</span>
          </Footer>
        </Provider>
      </Layout>
    )
  }
}

export default withRouter(App);
