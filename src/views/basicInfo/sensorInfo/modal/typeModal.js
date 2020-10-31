import React,{ Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import '../style.less';
import { Model } from '../../../../dataModule/testBone';
import { addSensorTypeUrl } from '../../../../dataModule/UrlList';
import  store from '../../../../store';
import { actionCreators as indexActionCreators } from '../../../../components/index/store';

const model = new Model();
class TypeModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,      //确定加载
            sensor_type: '',            //传感器类型
        }
    }

    createNewType(params) {
        this.setState({
            confirmLoading: true,
        });
        let me = this;
        model.fetch(
            params,
            addSensorTypeUrl,
            'post',
            function() {
                me.setState({
                    confirmLoading: false,
                })
                me.props.cancel(false);
                message.success("添加传感器类型成功");
                me.afterClose();
                store.dispatch(indexActionCreators.getSensorType());   //获取所有传感器的类型
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
        const {validateFields} = this.props.form;  //验证
        let repeat = false;
        validateFields();
        if(this.state.sensor_type === '') return;
        const index = this.props.types.findIndex((item) => item === this.state.sensor_type.toUpperCase())
        if(index > -1){
            message.warning('传感器类型已存在，检查后重新输入');
            repeat = true
        }
        if(repeat === true) return;
        let params = {
            type_name: this.state.sensor_type
        }
        this.createNewType(params);
    };
    
    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    };

    handleChange = (e) => {
        this.setState({
          [e.target.name]: (e.target.value + '传感器')
        })
    }

    //关闭窗口清除数据
    afterClose = () => {
        this.setState({
            sensor_type: '',
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
                title="新建传感器类型"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                afterClose={ this.afterClose }
                >
                <div>
                    <Form { ...formItemLayout }>
                        <Form.Item
                            label="传感器类型"
                            colon
                        >
                            {getFieldDecorator('sensor_type', {
                                rules: [{ required: true, message: '请输入传感器类型' }],
                            })(
                                <Input  name='sensor_type' onChange={this.handleChange} addonAfter="传感器" />
                            )}     
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            </div>
        )
    }
}

export default Form.create()(TypeModal);