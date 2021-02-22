import { Modal, Form, Input, message } from 'antd';
import React, { Component } from 'react';

import { Model } from '../../../dataModule/testBone'
import { getUserId } from '../../../publicFunction/index'

import { pumpInfoUrl } from '../../../dataModule/UrlList'

// const { Option } = Select;
const model = new Model();

class AddPumPModal extends Component{
    constructor(props){
        super(props);
        this.state={
            confirmLoading: false,
            pump_name: '',
            pump_code: '',
            fluid_flow: '',         //流量值
            create_by: '',
            note: ''
        }
    }

    //创建一个新的泵
    createNewPump(params) {
        let me = this;
        model.fetch(
            params,
            pumpInfoUrl,
            'post',
            function() {
                me.afterClose()
                me.props.cancel(false)
                message.success("添加成功")
                me.props.afterCreateOrEdit()   //创建完成后保持搜索条件
                me.setState({
                    confirmLoading: false,
                })
            },
            function() {
                // message.warning('发送数据失败，请重试')
                // console.log('发送数据失败，请重试')
                setTimeout(() => {
                    me.setState({
                        confirmLoading: false,
                    })
                }, 2000)
            }
        )
    }

    //点击确定
    handleOk = () => {
        const {validateFields} = this.props.form           //校验
        validateFields()
        if(this.state.pump_name === '' || this.state.pump_code === '' || this.state.fluid_flow === '')return 0
        let params = {
            pump_name: this.state.pump_name,
            pump_code: this.state.pump_code,
            fluid_flow: this.state.fluid_flow,
            create_by: getUserId(),
            note: this.state.note
        }
        // console.log(766, params)
        this.setState({
            confirmLoading: true,
        })
        this.createNewPump(params)
    }

    //弹窗关闭后的清空
    afterClose = () => {
        this.setState({
            pump_name: '',
            pump_code: '',
            fluid_flow:'',
            note:''
        })
    }

    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    }

    //获取输入框里的内容
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //获取流量值
    // getPumpFlow = (string) => {
    //     this.setState({
    //         fluid_flow: string
    //     })
    //     // console.log(25, this.state.fluid_flow)
    // }

    render(){
        const { addPumpVisible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading } = this.state
        const formItemLayout = {
            labelCol: {
              span: 6
            },
            wrapperCol: {
              span: 14,
            },
        }
        return(
            <div>
                <Modal
                    title="新增控制泵"
                    visible={addPumpVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={ confirmLoading }
                >
                    <div>
                        <Form { ...formItemLayout }>
                        <Form.Item
                                label="泵的名称"
                                colon
                            >
                                {getFieldDecorator('pump_name', {
                                    rules: [{ required: true, message: '请输入泵的名称' }],
                                })(
                                    <Input  name="pump_name" onChange={this.handleChange} autoComplete="off" />
                                )}
                            </Form.Item>

                            <Form.Item
                                label="泵的编号"
                                colon
                            >
                                {getFieldDecorator('pump_code', {
                                    rules: [{ required: true, message: '请输入泵的编号' }],
                                })(
                                    <Input  name="pump_code" onChange={this.handleChange} autoComplete="off"/>
                                )}
                            </Form.Item>

                            <Form.Item
                                label="当前流量"
                                colon
                            >
                                {getFieldDecorator('fluid_flow', {
                                    rules: [{ required: true, message: '请选择泵的当前流量' }],
                                })(
                                    // <Select 
                                    //     onSelect={ (string) => this.getPumpFlow(string) }
                                    // >
                                    //     <Option value="5">5</Option>
                                    //     <Option value="10">10</Option>
                                    //     <Option value="15">15</Option>
                                    // </Select>
                                    <Input name="fluid_flow" onChange={this.handleChange} autoComplete="off"/>
                                )}
                            </Form.Item>

                            <Form.Item
                                label="备注"
                                colon
                            >
                                <Input  name="note" onChange={this.handleChange} autoComplete="off"/>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(AddPumPModal);
