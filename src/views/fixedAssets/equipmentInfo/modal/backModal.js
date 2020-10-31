import React, { Component } from 'react';
import { Modal, message, Form, Input } from 'antd';
import { Model } from "../../../../dataModule/testBone";
import { backToFactory } from '../../../../dataModule/UrlList';


const model = new Model();
class BackModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storehouse: '',
            storage_location: '',
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //更改设备状态
    changeStatus = () => {
        const me = this;
        model.fetch(
            {
                equipment_id: this.props.data.key,
                storehouse: this.state.storehouse,
                storage_location: this.state.storage_location,
            },
            backToFactory,
            'post',
            function() {
                message.success("操作成功");
                me.props.closeModal();
                me.props.afterCreateOrEdit();
            },
            function() {
                message.warning('操作失败，请重试');
                return false;
            },
            false
            )
      }

    handleOk = (e) => {
        const { validateFields } = this.props.form;  //验证
        validateFields();
        const { storehouse, storage_location} = this.state;
        if(storehouse === '' || storage_location === '')  return;
        this.changeStatus();
    };

    afterClose = () => {
        this.setState({
            storehouse: '',
            storage_location: '',
        })
    }
        
    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              span: 5
            },
            wrapperCol: {
              span: 10,
            },
          };

        return (
            <div>
                 <Modal
                    title="调拨回厂"
                    visible={ this.props.visible }
                    onOk={ this.handleOk }
                    onCancel={ this.props.closeModal }
                    afterClose={ this.afterClose }
                >
                    <p>您确定要将以下设备调拨回厂么？</p>
                    <p style={{marginLeft: '30px'}}>主机编号：{this.props.data.engine_code}</p>
                    <p style={{marginLeft: '30px'}}>主机名称：{this.props.data.engine_name}</p>
                    <p style={{marginLeft: '30px'}}>设备编号：{this.props.data.equipment_code}</p>

                    <Form { ...formItemLayout }>
                        <Form.Item
                            label='调回仓库'
                            colon
                        >
                            
                            {getFieldDecorator('storehouse', {
                                        rules: [{ required: true, message: '请输入仓库' }],
                                    })(
                                        <Input  name="storehouse" style={{width: '200px'}} onChange={this.handleChange} />
                            )}
                           
                        </Form.Item>
                        <Form.Item
                            label='调回库位'
                            colon
                        >
                            {getFieldDecorator('storage_location', {
                                rules: [{ required: true, message: '请输入设备库位' }],
                            })(
                                <Input  name="storage_location" style={{width: '200px'}} onChange={this.handleChange} />
                            )}
                           
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(BackModal);