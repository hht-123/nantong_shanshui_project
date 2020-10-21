import React,{ Component } from 'react';
import { Modal, Descriptions } from 'antd';


class EquipInfo extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
        }
    }
    
    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    };

    render() {
        const { visible, data } = this.props;
        const { confirmLoading } = this.state;
        // console.log(data)
        if (data.length === 0) return null

        return (
        <div>
            <Modal
                title="设备详情"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                footer={null}
                onOk={ this.handleCancel }
                onCancel={ this.handleCancel }
                width="800px"
                >
                <div>
                    <Descriptions bordered={true} column={2} size='middle'>
                        <Descriptions.Item label="主机编号:"  >{ data[0].engine_code }</Descriptions.Item>
                        <Descriptions.Item label="主机型号:" >{ data[0].engine_name }</Descriptions.Item>
                        <Descriptions.Item label="联系人:">{ data[0].contact_person }</Descriptions.Item>
                        <Descriptions.Item label="联系人电话:">{ data[0].contact_tel}</Descriptions.Item>
                        <Descriptions.Item label="设备配置" span={2} ></Descriptions.Item>
                        { data.map((item,index) => {
                        return    <Descriptions.Item key={index} label={item.type_name} >{item.sensor_model}</Descriptions.Item>
                        })}
                    </Descriptions>
                </div>
            </Modal>
        </div>
        )
    }
}
export default EquipInfo;