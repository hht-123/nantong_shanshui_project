import React, { Component } from 'react';
import { Steps, Button, message } from 'antd';
import './style.less'
import Sensors from './sensor/index'
import Equipments from './Equipment/index'
import Pumps from './pump/index'


const { Step } = Steps;

const steps = [
  {
    title: '创建设备',
    content:<Equipments/>,
  },
  {
    title: '配置传感器',
    content: <Sensors/>,
  },
  {
    title: '配置控制泵',
    content: <Pumps/>,
  },
  {
    title: '设备调拨',
    content: 'Last-content',
  },
];


class EquipmentPro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        }
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
      }
    
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    render() {
        const { current } = this.state
        return (
            <div>
                <div className="name">设备创建配置流程</div>
                <div className='wrapper'>
                        <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
                </Steps>
                <div className="steps-content">
                    {steps[current].content}
                </div>
                <div className="steps-action">
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => this.next()}>
                    下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                    完成
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    上一步
                    </Button>
                )}
                </div>
                        </div>
            </div>
        )
    }
}

export default EquipmentPro
