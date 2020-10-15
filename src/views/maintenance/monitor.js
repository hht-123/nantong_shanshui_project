import React, { Component } from 'react';
import { Model } from '../../dataModule/testBone';

import  './style/monitor.less';
import Line from './publicComponents/sensorLine';
import { equipmentUrl } from '../../dataModule/UrlList';

import { Icon, Tabs } from 'antd';
import { Link } from 'react-router-dom';

const model = new Model()
const { TabPane } = Tabs;


class Monitor extends Component{
  constructor(props) {
    super (props);
    this.state = {
      equipmentData: [],
      sensorData:[],
      whetherTest: false, 
      whetherTest1: true,
      // hover: false,
    }
  }

  componentDidMount() {
    console.log(this.props.match.params.equipment_aid);
    const equipment_aid = this.props.match.params.equipment_aid;
    let params = this.getparams(equipment_aid)
    this.getEquipmentData(params)
    this.getSensorData('11:11')
  }

  getparams( equipment_id=null ) {
    let params = {};
    params = {
      equipment_id,
    }
    return params;
  } 

  getEquipmentData(params) {
    for (let i in params) {
      if (params[i] === undefined || params[i] === null) {
        params[i] = ''
      }
    }
    let me = this;
    model.fetch(
      params,
      equipmentUrl,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
          me.setState({
            equipmentData: response.data.data[0]
          })
          console.log(me.state.equipmentData)
        } else {
          me.setState({
            equipmentData: response.data.data,
          })
          console.log(me.state.equipmentData)
        }
      },
      function() {
        console.log('加载失败，请重试')
      },
      this.state.whetherTest
    )
  }

  getSensorData(params) {
    for (let i in params) {
      if (params[i] === undefined || params[i] === null) {
        params[i] = ''
      }
    }
    let me = this;
    model.fetch(
      params,
      'api/sensor.json',
      'get',
      function(response) {
        if (me.state.whetherTest1 === false) {
          me.setState({
            sensorData: response.data.data
          })
        } else {
          me.setState({
            sensorData: response.data.data,
          })
          console.log(me.state.sensorData)
        }
      },
      function() {
        console.log('加载失败，请重试')
      },
      this.state.whetherTest1
    )
  }

  callback = (key) => {
    console.log(key);
  }

  handleStatusColor = (numb) => {
    if ( numb === '0' ) {
      return  { background:'green'}
    }else if (numb === '1') {
      return  { background:'red'}
    }else if (numb === '2') {
      return  { background:'gray'}
    }else if (numb === '3') {
      return  { background:'bule'}
    }
  }

  handleStatus = (numb) => {
    if ( numb === '0' ) {
      return  '在线'
    }else if (numb === '1') {
      return  '报修'
    }else if (numb === '2') {
      return  '停运'
    }else if (numb === '3') {
      return  '维护'
    }
  }

  // onMouseEnter = () => {
  //   this.setState({
  //       hover: true,
  //   });
  // }

  // onMouseLeave = () => {
  //   this.setState({
  //       hover: false,
  //   })
  // }

  // linkStyle = () => {
  //   if (this.state.hover) {
  //   return  {color: '#1890FF', fontSize: '18px'}
  //   } else {
  //   return  {}
  //   }
  // }

  render() {
    const equipment_id = this.props.match.params.equipment_aid;
    return (
      <div className='monitor'>
        <span className='name'>设备编号：{ this.state.equipmentData.equipment_code }</span>
        <span className='company'>用户单位：{ this.state.equipmentData.client_unit }</span>
        <div className='wrapper'>
            <div className='table'>
                <span ><Icon className='icon' type="warning" theme="filled" /><div className='describe' >水质提醒记录</div></span>
                <Link to={`/app/equipmentMaintenance/${ equipment_id}`}><span className='main'><Icon className='icon' type="tool" theme="filled" /><div className='describe' >设备维护</div></span></Link>
                <span className='main'><Icon className='icon' type="dashboard" theme="filled" /><div className='describe' >传感器标定</div></span>
                <span className='main'><Icon className='icon' type="video-camera" theme="filled" /><div className='describe' >视频监控</div></span>
                <span className='main'><div className='statusColor' style={ this.handleStatusColor(this.state.equipmentData.status) } >{ this.handleStatus(this.state.equipmentData.status) }</div><div className='status' >设备状态</div></span>
                <span className='main'><Icon className='icon' type="profile" theme="filled" /><div className='describe' >设备详情</div></span>
            </div>
              <Tabs className='tab' defaultActiveKey="1" onChange={this.callback} type='card'>
                  {
                    this.state.sensorData.map((item, index) => {
                    return  <TabPane tab={ item.sensor_type } key={ index + 1}>
                                <Line sensor_type={ item.sensor_type } value_code={ item.value_code } measure_value={ item.measure_value } measure_time={ item.measure_time } />
                            </TabPane>
                    })
                  }
              </Tabs>
        </div>
      </div>
    )
  }
}

export default Monitor;