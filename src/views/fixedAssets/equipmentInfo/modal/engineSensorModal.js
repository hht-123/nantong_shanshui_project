import React,{ Component } from 'react';
import { Modal, Form, Input, DatePicker, message, Button } from 'antd';
import "../style.less"
import { Spin } from 'antd';



class EngineSensorModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            spinning: true,
        }
    }

    componentDidUpdate (prevProps) {
        if(this.props.data !== prevProps.data) {
            this.setState({
                spinning: false
            })
        }
    }

    //取消按钮
    handleCancel = () => {
        this.props.closeModal();
    }

    showTbale = () => {
        if(this.state.data.size === 0){
            console.log(1);
            return <div></div>;
        }else{
            this.setState({spinning: false})
            this.state.data.map((item) => {
                return (
                    <tr key="item.equipment_id" align="center" className='sideBodyTr'>
                        <td className='sideBodyTh'>{ item.type_name }</td>
                        <td className='sideBodyTh'>{ item.sensor_model }</td>
                        <td className='sideBodyTh'>{ item.sensor_code }</td>
                    </tr>
                )
            }) 
        }
    }

    render() {
        const { visible, data, title } = this.props;
        const { confirmLoading, spinning } = this.state;
        return(
            <Modal
                title={ '设备编号：' + title}
                visible={ visible }
                confirmLoading={ confirmLoading }
                footer={<Button type="primary" onClick={this.handleCancel}>关闭</Button>}
                destroyOnClose={ true }
                onCancel={ this.handleCancel }
            >
            <div className='sidePosition'>
                <table className='sideTable' border='1px'>
                    <thead className='sideHead'>
                        <tr align="center" className='sideheadTr'>
                            <th>传感器类型</th>
                            <th>传感器型号</th>
                            <th>传感器编号</th>
                        </tr>
                    </thead>
                    <tbody className='sideBody'>
                        {spinning === true ?
                            <tr align="center"  className='sideheadTr' style={{height: 100}}>
                                <td colSpan="3"><Spin /></td>
                            </tr> : data.size === 0 ? null :
                            data.map((item) => {
                                return(
                                    <tr key="item.sensor_code" align="center" className='sideBodyTr'>
                                    <td className='sideBodyTh'>{ item.type_name }</td>
                                    <td className='sideBodyTh'>{ item.sensor_model }</td>
                                    <td className='sideBodyTh'>{ item.sensor_code }</td>
                                </tr>
                                )
                            }) 
                        }
                    </tbody>
                </table>
            </div>
            </Modal>
        )
    }
}

export default EngineSensorModal;