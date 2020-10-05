import React, { Component } from 'react';
import '../../../style/wrapper.less'
import './engine.less'
import EngineTable from './engineTable';
import { DatePicker,Button, Input } from 'antd';


const {RangePicker} = DatePicker;
const size = 'middle';

class EngineInfo extends Component{
  constructor(props) {
    super (props);
  }
  render() {
    return (
      <div>
        <div className='name'>主机信息：</div>
        <div className='wrapper'>
        <div className='dateWrapper' className='func'>
            <div>
                    <div style={{float: 'left'}} >
                        <div className="input">开始生产日期:</div>
                        <RangePicker  size={size} />
                    </div>
                    
                    <div className="inputWrapper" >
                        <div className="input">结束生产日期:</div>
                        <RangePicker size={size} />
                    </div>

                    <div className="inputWrapper" >
                        <div className="input">主机编号:</div>
                        <Input size={size} style={{width: "300px"}}/>
                    </div>
                    
                </div>
                <div className="line"></div>
                <div style={{marginTop: "15px"}}>
                    <Button type="primary" className="button">搜索</Button>
                    <Button type="primary" className="button">重置</Button>
                    <Button type="primary" className="button">新增主机</Button>
                </div>
            </div>
          <div className='tableWrapper'>
            <EngineTable />
          </div>
        </div>
      </div>
    )
  }
}
export default EngineInfo;