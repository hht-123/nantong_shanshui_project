import React,{ Component } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import '../style.less';
import { Model } from '../../../../dataModule/testBone';
import { addSensorModelUrl } from '../../../../dataModule/UrlList'

const model = new Model();
const { Option } = Select;
class ModelModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,      //确定加载
            sensor_type: '',            //传感器类型
            allmodel: '',
            sensor_model: '',           //传感器型号
            notice_content: '',         //提示内容
            sensor_threshold: ''
        }
    }

    createNewModel(params) {
        this.setState({
            confirmLoading: true,
        });
        let me = this;
        model.fetch(
            params,
            addSensorModelUrl,
            'post',
            function() {
                me.setState({
                    confirmLoading: false,
                })
                me.props.cancel(false)
                message.success("添加传感器型号成功");
                me.afterClose();
                if(me.state.sensor_type.length > 0){
                    this.getSensorModel({type_name: me.state.sensor_type});
                }
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

    //获取型号
    getSensorModel(params) {
        let me = this;
        model.fetch(
          params,
          addSensorModelUrl,
          'get',
          function(response) {
            me.setState({
                allmodel: response.data
            })
          },
          function() {
            message.warning('加载失败，请重试')
          },
          this.props.whetherTest
        )
      }

    //确定事件按钮
    handleOk = () => {
        const { validateFields } = this.props.form;
        const { typesAndAid } = this.props;
        const { sensor_model, sensor_type, allmodel, notice_content, sensor_threshold } = this.state;
        let typeAid = '';
        validateFields();
        if(sensor_model === '') return;
        if(sensor_type === '') return;
        if(sensor_threshold === '') return;
        if(notice_content === '') return;

        let repeat = false; 
        const index =  allmodel.findIndex((item) => sensor_model === item.sensor_model.toUpperCase())
        if(index > 0){
            message.warning('传感器型号已存在，检查后重新输入');
            repeat = true;
        }
        
        if(repeat === true) return;

        //获取对应的
        // typesAndAid所有传感器类型及其aid
        if(typesAndAid.size !== 0){
             typesAndAid.map((item) => {
                    if(item.get('type_name') === sensor_type){
                        typeAid = item.get('aid');
                        return 0;
                    }
                    return 0;
                })
        }

        let params = {
            sensor_type_id: typeAid,
            sensor_model,
            notice_content,
            sensor_threshold
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

    //选择传感器类型的事件
    getType = (string) => {
        this.setState({
            sensor_type: string
        })
        this.getSensorModel({type_name: string});
    }

    afterClose = () => {
        this.setState({
            sensor_type: '',            //传感器类型
            sensor_model: '',
            sensor_threshold: '',
            notice_content: ''
        })
    }

    render() {
        const { confirmLoading } = this.state;
        const { visible, types } = this.props
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              span: 6
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
                afterClose={ this.afterClose }
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
                                    {types.size !== 0? types.map((item) => <Option key={item} value={item}>{item}</Option>) : null}
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
                                <Input  name="sensor_model" onChange={this.handleChange} />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="传感器默认阈值"
                            colon
                        >
                            {getFieldDecorator('sensor_threshold', {
                                rules: [{ required: true, message: '请输入传感器默认阈值' }],
                            })(
                                <Input  name="sensor_threshold" onChange={this.handleChange} />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="默认提示内容"
                            colon
                        >
                            {getFieldDecorator('notice_content', {
                                rules: [{ required: true, message: '请输入传感器默认提示内容' }],
                            })(
                                <Input  name="notice_content" onChange={this.handleChange} />
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