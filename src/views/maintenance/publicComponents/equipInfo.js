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
        const { visible, data,  } = this.props;
        const { confirmLoading } = this.state;
        let Newdata = []
        if (data.length === 0 ) return null
        data.map((item) => {
            if(item.status === '1') {
                Newdata.push(item)
            } 
        })
    

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
                        { Newdata.map((item,index) => {
                            if(item.contact_person === undefined ) {
                                return null
                            } else {
                            return   [<Descriptions.Item  key='contact_person' label="联系人:">{ item.contact_person }</Descriptions.Item>,
                                    <Descriptions.Item key='contact_tel' label="联系人电话:">{ item.contact_tel}</Descriptions.Item>]
                            }
                        })}
                        {/* <Descriptions.Item label="设备配置" span={2} ></Descriptions.Item> */}
                        { Newdata.map((item,index) => {
                            if (item.type_name === undefined ) {
                                return  null
                            } else {
                                return    <Descriptions.Item key={index} label={item.type_name} >{item.sensor_model}</Descriptions.Item>
                            }                            
                        })}
                    </Descriptions>
                </div>
            </Modal>
        </div>
        )
    }
}
export default EquipInfo;