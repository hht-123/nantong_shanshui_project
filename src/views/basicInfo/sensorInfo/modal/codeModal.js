import React,{ Component } from 'react';
import { Modal, Form,  message, Select, Input } from 'antd';
import { Model } from '../../../../dataModule/testBone';
import '../style.less';
import { sensorModelUrl, addSensorUrl } from '../../../../dataModule/UrlList'

const model = new Model();
const { Option } = Select;
class CodeModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,      //确定加载
            sensorModels: [],           //获取所有型号 包括AID
            sensor_type: '',            //传感器类型
            sensor_model: '',           //传感器型号
            sensor_threshold: '',       //传感器阈值
            notice_content: '',         //提示内容
            default_compensation: '',   //默认补偿值
            note:'',
        }
    }

    //建立新传感器
    createNewCode(params) {
        this.setState({
            confirmLoading: true,
        });
        let me = this;
        model.fetch(
            params,
            addSensorUrl,
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

    //获取型号
    getSensorModel(params) {
        let me = this;
        model.fetch(
        params,
        sensorModelUrl,
        'get',
        function(response) {
            me.setState({
            sensorModels: response.data
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
        let modelAid = null;
        const { sensor_model, sensorModels, sensor_threshold, notice_content, default_compensation, note} = this.state;
        validateFields();
        if(this.state.engine_name === '') return;

        if(sensorModels.size !== 0){
            sensorModels.map((item) => {
                   if(item.sensor_model === sensor_model){
                        modelAid = item.aid;
                       return 0;
                   }
                   return 0;
               })
        }
        if(modelAid === null){
            message.warning('请检查是否选择正确');
            return 0;
        }
        
        let params = {
            sensor_model_id: modelAid,
            sensor_threshold,
            notice_content,
            default_compensation,
            note,
        }
        this.createNewCode(params);
        window.location.reload();
      };
    
    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false);
    };

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        })
    }
    handleSelect = (string, name) => {
        switch (name) {
            case 'type':
                this.setState({sensor_type:string});
                this.getSensorModel({type_name:string})
                break;
            case 'model':
                this.setState({sensor_model:string});
                break;
            default:
                return 0;
        }
    }
    //处理传感器型号数据
    handleSensorModelData = () => {
        const aftersensorModels = [];
        const { sensorModels } = this.state;
        if(sensorModels.size !== 0){
          sensorModels.map((item,index) => {
            aftersensorModels.push(item.sensor_model)
            return 0;
          })
        }
        return aftersensorModels;
      }

    render() {
        const { confirmLoading } = this.state;
        const { visible, types} = this.props
        const { getFieldDecorator } = this.props.form;

        const aftersensorModels = this.handleSensorModelData();

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
                title="新增传感器"
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
                                rules: [{ required: true, message: '请选择传感器类型' }],
                            })(
                                <Select 
                                    className='select' 
                                    onSelect={(string) => this.handleSelect(string,'type')} 
                                    placeholder='请选择传感器类型'
                                >
                                    {types.size !== 0? types.map((item) => <Option key={item} value={item}>{item}</Option>) : null}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="传感器型号"
                            colon
                        >
                            {/* onSelect={(string) => this.getSensorType(string)} */}
                            {getFieldDecorator('sensor_model', {
                                rules: [{ required: true, message: '请选择传感器型号' }],
                            })(
                                <Select 
                                    className='select' 
                                    onSelect={(string) => this.handleSelect(string,'model')} 
                                    placeholder='请选择传感器型号'
                                >
                                     {aftersensorModels.size !== 0? aftersensorModels.map((item,index) => <Option key={index} value={item}>{item}</Option>) : null}
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="默认补偿值"
                            colon
                        >
                                <Input  name="default_compensation" onChange={this.handleChange} />
                        </Form.Item>

                        <Form.Item
                            label="传感器阈值"
                            colon
                        >
                                <Input  name="sensor_threshold" onChange={this.handleChange} />
                        </Form.Item>

                        <Form.Item
                            label="提示内容"
                            colon
                        >
                                <Input  name="notice_content" onChange={this.handleChange} />
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            colon
                        >
                                <Input  name="note" onChange={this.handleChange} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            </div>
        )
    }
}

export default Form.create()(CodeModal);