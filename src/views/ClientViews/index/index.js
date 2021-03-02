import React, { Component } from 'react';

import { Model } from '../../../dataModule/testBone';
import { maintenanceUrl, verifyUrl } from '../../../dataModule/UrlList';

import './style.less'
import  Equipment   from './equipment';
import {getUserId, getRoleId}  from '../../../publicFunction/index';
// import { message } from 'antd';

const model = new Model()
class ClientIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            aid: '',
            equipment_code: '',
            client_unit: '',
            status: '0',
            region: '',
            whetherTest: false, 
            clientID:''
        }
      }
    
    componentDidMount() {
        this.getRoleData()
    }

    getClientEquipment(clientId) {
      const me = this
        model.fetch(
            {"client_id": clientId},
            maintenanceUrl,
            'get',
            function(response) {
                if (me.state.whetherTest === false) {
                  me.setState({
                    data: response.data.data
                  })
                  console.log(me.state.data)
                } else {
                  me.setState({
                    data: response.data.data
                  })
                }
              },
              function() {
                console.log('加载失败，请重试')
              },
              this.state.whetherTest
        )
    }
  
    getparams( status=null, client_unit=null, region=null) {
      let params = {};
      params = {
        status,
        client_unit,
        region,
      }
      return params;
    }  

    getRoleData() {
      const me = this
      model.fetch(
        {'user_id': getUserId(), 'role_id': getRoleId()},
        verifyUrl,
        'get',
        function(response) {
          me.setState({
            clientID: response.data.client_id
          })
          // console.log(response.data)
          me.getClientEquipment(me.state.clientID)
          // console.log(me.state.clientID)
      },
      function() {
        console.log('失败'); //失败信息
      },
      )
    }

  render() {
    const { data } = this.state
    const newData = []
    if(this.state.clientID === '') return null
    data.map(item =>{
      if( item.client_id === this.state.clientID && item.status !=='1'&& item.status !== '2' ) {
        newData.push(item)
      }
      return null
    })
    console.log(newData)
    if(newData.length === 0) {
      // message.warning('未分配设备')
      return null
    }

    return (
        <div className="client" >
            <div className="title" >
                循环水智慧管家远程监控系统
            </div>
            <div className='line-top'></div>
                <div  className='content' >
                    { newData.map((item,index) => {
                      return <Equipment key={ index } aid={ item.aid } equipment_code={ item.equipment_code }  status={ item.status } />
                    }) }
                </div>
            
        </div>
    )
  }

}

export default ClientIndex;