import React, { Component } from 'react';
import { Steps, Button, message } from 'antd';
import './style.less'
import { connect } from 'react-redux'
import {changeInputDisabled} from './store/actionCreators'
import Sensors from './sensor/index'
import Equipments from './Equipment/index'
import Pumps from './pump/index'
import Transfer from './transfer/index'
import AllocationModal from '../../fixedAssets/equipmentInfo/modal/allocationModal'
import store from '../../../store';


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
    title: '信息确认',
    content: <Transfer/>,
    },
];


class EquipmentPro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            allocationModalVisble: false,
            allocationEqiipmentInfo: {}
        }
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
        if( current > 0) {
            this.props.inputChange(true)
        } else {
            this.props.inputChange(false)
        }
      }
    
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
        if( current > 0) {
            this.props.inputChange(true)
        } else {
            this.props.inputChange(false)
        }
    }

    SubInfo() {
        message.success('创建设备成功')
        this.props.inputChange(false)
        this.setState({
            current: 0,
        })
    }

    allocation = () => {
        this.setState({
            allocationModalVisble: true
        })
    }

    closeModal = () => {
        this.setState({
            allocationModalVisble: false
        })
    }
    
    render() {
        const { current, allocationModalVisble, allocationEqiipmentInfo } = this.state
        return (
            <div>
                <div className="name">设备创建配置流程</div>
                <div className='wrapper'>
                    <Steps current={current} style={{marginTop:'16px'}}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div className="steps-content">{steps[current].content}</div>
                    <div className="steps-action">
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => this.next()}>
                            下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => this.SubInfo()}>
                                完成
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => this.allocation()} style={{marginLeft:'8px'}}>
                                设备调拨
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                            上一步
                            </Button>
                        )}
                    </div>
                    <div style={{clear: 'both'}}></div>
                    <AllocationModal
                        visible = {allocationModalVisble}
                        closeModal={ this.closeModal }
                        data = { allocationEqiipmentInfo }
                    />
                </div>
            </div>
        )
    }
}

const dispatchToProps = (dispatch) =>{
    return {
        inputChange(value){
            const action = changeInputDisabled(value)
            store.dispatch(action)
        }
    }
}


export default connect(null, dispatchToProps)(EquipmentPro)
