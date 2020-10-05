import React, { Component } from 'react';
import { Input, Select, Button } from 'antd';

// import { Model } from '../../dataModule/testBone'

import '../maintenance/style/index.less';
import  Equipment   from '../maintenance/publicComponents/equipment.js';

class Maintenance_index extends Component {


  render() {

    const { Option } = Select;

    function handleChange(value) {
        console.log(`selected ${value}`);
      }

    return (
        <div>
            <div className="title" style={{overflowX: 'auto', marginTop: 60}}>
                循环水智慧管家远程监控系统
            </div>
            <div className='line-top'></div>
            <div className='Search'>
                <div className='search-area'>地区筛选:</div>
                <Input className='area'/>
                <div className='search-user'>用户单位:</div>
                <Input className='user'/>
                <div className='search-status'>设备状态:</div>
                <div className='status'>
                    <Select size='small' defaultValue="在线" style={{ width: 120, } } onChange={handleChange}>
                        <Option value="0">在线</Option>
                        <Option value="1">报修</Option>
                        <Option value="2">停运</Option>
                        <Option value="3">维护</Option>
                    </Select>
                </div>
                <div className='button1'>
                    <Button type="primary">搜索</Button>
                </div>
                <div className='button2'>
                    <Button >重置</Button>
                </div>
                <div className='button3'>
                    <Button type="primary">新增交付属性</Button>
                </div>
            </div>
            <div >
                <div className="areaName" style={{overflowX: 'auto', marginTop: 40}}>江苏地区</div>
                <div className='line-bottom'></div>
                <Equipment/>
            </div>
        </div>
        
    )
  }
}



export default Maintenance_index;