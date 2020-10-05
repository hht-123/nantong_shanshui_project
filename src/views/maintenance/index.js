import React, { Component } from 'react';

import { Model } from '../../dataModule/testBone'

import '../maintenance/style/index.less';

class Maintenance_index extends Component {


  render() {
    return (
        <div>
            <div className="title" style={{overflowX: 'auto', marginTop: 60}}>
                循环水智慧管家远程监控系统
            </div>
            <div className='line-top'></div>
            <div className='Search'>
                <div className='search-area'>地区筛选:</div>
            </div>
        </div>
    )
  }
}



export default Maintenance_index;