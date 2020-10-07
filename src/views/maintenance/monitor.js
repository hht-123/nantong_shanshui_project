import React, { Component } from 'react';
import './style/wrapper.less';
import './style/monitor.less';

import { Icon } from 'antd';


class Monitor extends Component{
//   constructor(props) {
//     super (props);
//   }

  render() {
    return (
      <div className='monitor'>
        <span className='name'>设备编号：</span>
        <span className='company'>用户单位：</span>
        <div className='wrapper'>
            <div className='table'>
                <span></span>
                <span className='main'>
                    {/* <Icon className='icon' type="warning" theme="filled" /> */}
                    </span>
                <span className='main'>3</span>
                <span className='main'>4</span>
                <span className='main'>5</span>
                <span className='main'>6</span>
            </div>
        </div>
      </div>
    )
  }
}

export default Monitor;