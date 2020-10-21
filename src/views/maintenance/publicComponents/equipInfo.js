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
        const { visible,  } = this.props;
        const { confirmLoading } = this.state;

        return (
        <div>
            <Modal
                title="设备详情"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleCancel }
                onCancel={ this.handleCancel }
                width="800px"
                >
                <div>
                    <Descriptions bordered={true} column={2} size='middle'>
                        <Descriptions.Item label="主机编号:" span={2}  >123123123</Descriptions.Item>
                        <Descriptions.Item label="出厂日期:">2020-10-19</Descriptions.Item>
                        <Descriptions.Item label="交付日期:">2020-10-22</Descriptions.Item>
                        <Descriptions.Item label="联系人:">121212</Descriptions.Item>
                        <Descriptions.Item label="联系人电话:">123456789</Descriptions.Item>
                        <Descriptions.Item label="设备配置：" span={2} ></Descriptions.Item>
                        <Descriptions.Item label="pH传感器" >111111111</Descriptions.Item>
                    </Descriptions>
                </div>
            </Modal>
        </div>
        )
    }
}
export default EquipInfo;