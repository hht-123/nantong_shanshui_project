import React,{ Component } from 'react';
import { Modal,  Descriptions,  } from 'antd';


class CompanyInfo extends Component {
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

        return (
        <div>
            <Modal
                title="客户基础信息"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                footer={null}
                onOk={ this.handleCancel }
                onCancel={ this.handleCancel }
                width="800px"
                >
                <div>
                <Descriptions bordered>
                    <Descriptions.Item label="客户单位" span={2}>{data.client_unit}</Descriptions.Item>
                    <Descriptions.Item label="客户邮编">{data.client_zip_code}</Descriptions.Item>
                    <Descriptions.Item label="客户行业">{data.client_industry}</Descriptions.Item>
                    <Descriptions.Item label="地区">{data.region}</Descriptions.Item>
                    <Descriptions.Item label="单位电话">{data.unit_phone}</Descriptions.Item>
                    <Descriptions.Item label="单位传真">{data.unit_fax}</Descriptions.Item>
                    <Descriptions.Item label="单位地址" span={2}>{data.client_address}</Descriptions.Item>
                    <Descriptions.Item label="备注" span={3} >{data.note}</Descriptions.Item>
                </Descriptions>
                </div>
            </Modal>
        </div>
        )
    }
}
export default CompanyInfo;
