import React, { Component } from 'react';
import '../../../style/wrapper.less'
import './engine.less'
import EngineTable from './engineTable';

class EngineInfo extends Component{
  constructor(props) {
    super (props);
  }

  render() {
      return (
        <div>
          <div className='name'>主机信息：</div>
          <div className='wrapper'>
            <div className='func'>
              <div>
                <label className="date">开始生产日期</label>
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