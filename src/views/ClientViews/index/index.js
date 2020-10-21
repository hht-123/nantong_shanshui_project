import React, { Component } from 'react';

import { Model } from '../../../dataModule/testBone';
import { maintenanceUrl } from '../../../dataModule/UrlList';

import './style.less'
import  Equipment   from './equipment';

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
        }
      }
    
    componentDidMount() {
        const me = this
        model.fetch(
            "13:123",
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

  render() {
    const { data } = this.state

    return (
        <div className="client" >
            <div className="title" >
                循环水智慧管家远程监控系统
            </div>
            <div className='line-top'></div>
                <div  className='content' >
                    { data.map((item,index) => {
                      return <Equipment key={ index } aid={ item.aid } equipment_code={ item.equipment_code }  status={ item.status } />
                    }) }
                </div>
            
        </div>
    )
  }

}

export default ClientIndex;