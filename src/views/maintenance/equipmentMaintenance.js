import React, { Component } from 'react';
// import { Model } from '../../dataModule/testBone';

import  './style/monitor.less';

import {} from 'antd';

// const model = new Model()

class Monitor extends Component{
  constructor(props) {
    super (props);
    this.state = {
    }
  }

  render() {
    return (
      <div className='monitor'>
        <span className='name'>设备编号：{ this.state.equipmentData.equipment_code }</span>
        <div className='wrapper'>

        </div>
      </div>
    )
  }
}

export default Monitor;