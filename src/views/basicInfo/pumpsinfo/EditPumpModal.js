import { Modal, Form, Input, message } from 'antd';
import React, { Component } from 'react';

import { pumpInfoUrl } from '../../../dataModule/UrlList'

import { Model } from '../../../dataModule/testBone'
import { getUserId } from '../../../publicFunction/index'

// const { Option } = Select;
const model = new Model();
class DeletePump extends Component{
    constructor(props){
        super(props)
        this.state = {
            confirmLoading: false,
            fluid_flow: '',
            mod_by: '',
            url: ''
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.editInfo !== prevProps.editInfo){
            let editInfo = this.props.editInfo;
            this.setState({
                fluid_flow: editInfo.fluid_flow,
                url: `${pumpInfoUrl}${editInfo.key}/`
            })
        }
    }

    //修改泵的信息
    EditPump = (params) => {
        let me = this
        model.fetch(
            params,
            me.state.url,
            'put',
            function() {
                me.props.cancel(false)
                message.success('编辑成功')
                me.props.afterCreateOrEdit()
                me.setState({
                    confirmLoading: false,
                })
            },
            function() {
                console.log('修改失败，请重试')
            }
        )
    }

    //点击确定
    handleOk = () => {
        const {validateFields} = this.props.form
        validateFields();
        if(this.state.fluid_flow === '') return;
        let params = {
            fluid_flow: this.state.fluid_flow,
            mod_by: getUserId()
        }
        this.setState({
          confirmLoading: true,
        })
        // console.log(89,params)
        this.EditPump(params)
    }

     //获取流量值
    // getPumpFlow = (string) => {
    //     this.setState({
    //         fluid_flow: string
    //     })
    // }

    //获取输入框里的内容
    handleChange = (e) => {
        this.setState({
            fluid_flow: e.target.value
        })
    }

    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    }

    render(){
        const { EditPumpVisible } = this.props
        const { confirmLoading, fluid_flow } = this.state
        const { getFieldDecorator } = this.props.form
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
                    title="编辑控制泵信息"
                    visible={EditPumpVisible}
                    onCancel={this.handleCancel}
                    onOk={ this.handleOk }
                    confirmLoading={confirmLoading}
                    destroyOnClose={true}
                >
                    <div style={{margin: '20px auto'}}>
                        <Form { ...formItemLayout }>
                            <Form.Item
                                    label="当前流量"
                                    colon
                                >
                                    {getFieldDecorator('fluid_flow', {
                                        rules: [{ required: true, message: '请选择泵的当前流量' }],
                                        initialValue: fluid_flow
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
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(DeletePump)
