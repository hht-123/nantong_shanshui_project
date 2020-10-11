import React,{ Component } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import '../style.less';
import { Model } from '../../../../dataModule/testBone';


const model = new Model();
const { Option } = Select;
class ModelModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,      //确定加载
            sensor_type: '',            //传感器类型
            sensor_model: '',           //传感器型号
        }
    }

    createNewModel(params) {
        this.setState({
            confirmLoading: true,
        });
        let me = this;
        model.fetch(
            params,
            '/',
            'post',
            function() {
                me.setState({
                    confirmLoading: false,
                })
                me.props.cancel(false)
            },
            function() {
                message.warning('发送数据失败，请重试')
                setTimeout(() => {
                    me.setState({
                        confirmLoading: false,
                    });
                    }, 2000)
            },
            this.props.whetherTest 
        )
    }

    //确定事件按钮
    handleOk = () => {
        const {validateFields} = this.props.form;
        validateFields();
        if(this.state.engine_name === '') return;
        if(this.state.sensor_type === '') return;
        let params = {
            type_name: this.state.sensor_type,
            sensor_model: this.state.sensor_model,
        }
        this.createNewModel(params);
    };
    
    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    };

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        })
    }

    getType = (string) => {
        this.setState({
            sensor_type: string
        })
    }

    render() {
        const { confirmLoading } = this.state;
        const { visible } = this.props
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              span: 5
            },
            wrapperCol: {
              span: 16,
            },
          };
        return (
            <div>
                <Modal
                title="新增传感器型号"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                >
                <div>
                    <Form { ...formItemLayout }>
                        <Form.Item
                            label="传感器类型"
                            colon
                        >
                            {/* onSelect={(string) => this.getSensorType(string)} */}
                            {getFieldDecorator('sensor_type', {
                                rules: [{ required: true, message: '请输入传感器类型' }],
                            })(
                                <Select className='select' placeholder='请选择传感器类型' onSelect={(string) => this.getType(string)} >
                                    <Option value="PH值传感器">PH值传感器</Option>
                                    <Option value="电导率传感器">电导率传感器</Option>
                                    <Option value="浊度传感器">浊度传感器</Option>
                                    <Option value="荧光度传感器">荧光度传感器</Option>
                                    <Option value="COD传感器">COD传感器</Option>
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="传感器型号"
                            colon
                        >
                            {getFieldDecorator('sensor_model', {
                                rules: [{ required: true, message: '请输入传感器类型' }],
                            })(
                                <Input  name="sensor_type" onChange={this.handleChange} />
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            </div>
        )
    }
}

export default Form.create()(ModelModal);