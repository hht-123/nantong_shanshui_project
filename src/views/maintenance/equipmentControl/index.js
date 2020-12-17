import React, { Component } from 'react';
import { Model } from '../../../dataModule/testBone';

import  './style.less';
import { websocketUrl, equipmentUrl } from '../../../dataModule/UrlList';

import { Button, PageHeader } from 'antd';
import { createWebSocket ,closeWebSocket , websocket } from './websocket';
import { throttle } from '../../../publicFunction';

const model = new Model()

class EquipemenControl extends Component{
  constructor(props) {
    super (props);
    this.state = {
        equipmentIdData: [],
        whetherTest: false, 
        aim_id:"",
        equipment_code: ""
    }
  }


  componentDidMount() {
    this.setState({
        equipment_id: this.props.match.params.equipment_id
    })
    let id = this.getId(this.props.match.params.equipment_id)
    this.getEquipmentID(id)

    const url = 'ws://10.41.7.235:90/';
    createWebSocket(url, this)
  }

  componentWillUnmount(){
    closeWebSocket();
  }

  //得到设备编号
  getId(equipment_id = null) {
    let params = {};
    params = {
      equipment_id,
    }
    return params;
  }

  getEquipmentID(params) {
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
            equipment_code: response.data.data[0].equipment_code
          })
          me.getAimId(response.data.data[0].equipment_code);
          // console.log(me.state.equipmentIdData)
        }
      },
      function() {
        console.log('加载失败，请重试')
      },
      false
    )
  }

  //为了得到aim_id
  getAimId(code) {
    let me = this;
    model.fetch(
      {
        "object_id": code,
        "distinguish_code":"0"
      },
      websocketUrl,
      'get',
      function(response) {
          me.setState({
            aim_id: response.data.websocket_id,
          })
      },
      function() {
        console.log('加载失败，请重试')
      },
      this.state.whetherTest
    )
  }

  contect = throttle(() => {      
    let json ={
        send_id:"325",                           //用户id
        equipment_code: this.state.equipment_code,   //设备id      
        action: "11",
        distinguish_code: "1",
        aim_id: this.state.aim_id,
		}
    console.log(JSON.stringify(json));
    websocket.send(JSON.stringify(json));
  }, 4000);

  close = throttle(() => {      
    let json ={
        send_id:"325",                           //用户id
        equipment_code: this.state.equipment_code,   //设备id      
        action: "12",
        distinguish_code: "1",
        aim_id: this.state.aim_id,
		}
    console.log(JSON.stringify(json));
    websocket.send(JSON.stringify(json));
  }, 4000);


  render() {
    

    return (
      <div className='equipemenControl'>
        <PageHeader className='row'
          onBack={() => window.history.back()}
          title="返回"
        />
        <span className='name'>设备编号：{ this.state.equipment_code }</span>
        <div className='wrapper'>
          <span className='pageName'>设备控制</span>
          <Button onClick={ this.contect } >发送信息</Button>
          <Button onClick={ this.close } >关闭</Button>
        </div>
      </div>
    )
  }
}

export default EquipemenControl;