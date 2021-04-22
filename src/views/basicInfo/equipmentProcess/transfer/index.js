import React, { Component } from 'react';
import './style.less'



class Transfer extends Component {
    render() {
        return (
            <div>
                <div className="sensorInfo">
                    <div className='sensorTitle'>传感器配置：</div>
                    <div className='sensorCont'>
                        <div><label>传感器类型：</label><span>11</span></div>
                        <div><label>传感器型号：</label><span>11</span></div>
                        <div><label>传感器编号：</label><span>11</span></div>
                    </div>
                    <div className='sensorCont'>
                        <div><label>传感器类型：</label><span>11</span></div>
                        <div><label>传感器型号：</label><span>11</span></div>
                        <div><label>传感器编号：</label><span>11</span></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Transfer

