import React, { Component } from 'react';
import '../style.less'


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
                <div className="baseInfo">
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
                <div>
                    {
                        pumps.map((item, index) => {
                            return (
                                <div key='name' className="pumpInfos">
                                    <label>控制泵的名称：</label>
                                    <span>{ item.name }</span>
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

