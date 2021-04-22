import React, { Component } from 'react';
import './style.less'


class Transfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pumps: [{ name: '一号泵' }],
        }
    }
    render() {
        const { pumps } = this.state
        return (
            <div>
                <div className="baseInfoss">
                    <ul >
                        <li>
                            <label>设备编号：</label>
                            <span>2021422</span>
                        </li>
                        <li>
                            <label>主机：</label>
                            <span>一号机</span>
                        </li>
                        <li>
                            <label>仓库：</label>
                            <span>421</span>
                        </li>
                    </ul>
                    <ul className='leftInfo'>
                        <li>
                            <label>库位：</label>
                            <span>421</span>
                        </li>
                        <li>
                            <label>配置人：</label>
                            <span>admin</span>
                        </li>
                        <li>
                            <label>备注：</label>
                            <span>新建测试</span>
                        </li>
                    </ul>
                </div>
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
                <div>
                    {
                        pumps.map((item, index) => {
                            return (
                                <div key='name' className="pumpInfos">
                                    <label>控制泵的名称：</label>
                                    <span>{item.name}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}

export default Transfer

