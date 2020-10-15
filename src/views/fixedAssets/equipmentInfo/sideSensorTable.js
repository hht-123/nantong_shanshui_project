import React, { Component } from 'react';
import './style.less'

class SideSensorTable extends Component{
  

    render() {
        return (
            <div className='sidePosition'>
                <div className='sidetitle'>XX设备传感器详情:</div>
                <table className='sideTable' border='1px'>
                    <thead className='sideHead'> 
                        <tr align="center" className='sideheadTr'>
                            <th>传感器类型</th>
                            <th>传感器型号</th>
                            <th>传感器编号</th>
                        </tr>
                    </thead>
                    <tbody className='sideBody'>
                        <tr align="center" className='sideBodyTr'>
                            <th className='sideBodyTh'>PH传感器</th>
                            <th className='sideBodyTh'>PH-BTA4</th>
                            <th className='sideBodyTh'>202010092984</th>
                        </tr>
                        <tr align="center" className='sideBodyTr'>
                            <th className='sideBodyTh'>PH传感器</th>
                            <th className='sideBodyTh'>PH-BTA4</th>
                            <th className='sideBodyTh'>202010092984</th>
                        </tr>
                    </tbody>
                    
                </table>
            </div>
        )
    }
}

export default SideSensorTable;
