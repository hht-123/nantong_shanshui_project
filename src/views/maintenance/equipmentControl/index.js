import React, { Component } from 'react';
import { Model } from '../../../dataModule/testBone';

import  './style.less';
import { websocketUrl } from '../../../dataModule/UrlList';

import { Button, PageHeader } from 'antd';
import { createWebSocket ,closeWebSocket , websocket, backInfo } from './websocket';
import { throttle } from '../../../publicFunction';

const model = new Model()

class EquipemenControl extends Component{
  constructor(props) {
    super (props);
    this.state = {
        equipmentIdData: [],
        whetherTest: false, 
        aim_id:"",
        equipment_id: ""
    }
  }

	
	componentDidUpdate(prevProps){
		if(backInfo !== prevProps.backInfo){
			console.log("backInfo",backInfo);
		}
	}

  componentDidMount() {
    this.setState({
        equipment_id: this.props.match.params.equipment_id
    })
    const url = 'ws://10.41.119.14:90';
    createWebSocket(url)
    this.getAimId();
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

  //为了得到aim_id
  getAimId() {
    let me = this;
    model.fetch(
      {
        "object_id": this.props.match.params.equipment_id,
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
        send_id:"325",                         //用户id
        equipment_id: this.state.equipment_id,   //设备id      
        action: "打开",
        distinguish_code: "1",
        aim_id: this.state.aim_id,
		}
		console.log(backInfo)
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
        <span className='name'>设备编号：{ this.state.equipmentIdData.equipment_code }</span>
        <div className='wrapper'>
          <span className='pageName'>设备控制</span>
          <Button onClick={ this.contect } >发送信息</Button>
        </div>
      </div>
    )
  }
}

export default EquipemenControl;