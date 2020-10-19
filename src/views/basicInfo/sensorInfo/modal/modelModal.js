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
        const { sensor_model, sensor_type, allmodel } = this.state;
        let typeAid = '';
        validateFields();
        if(sensor_model === '') return;
        if(sensor_type === '') return;

        let repeat = false; 
        const index =  allmodel.findIndex((item) => sensor_model === item.sensor_model.toUpperCase())
        if(index > 0){
            message.warning('传感器型号已存在，检查后重新输入');
            repeat = true;
        }
        
        if(repeat === true) return;

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
        }

        console.log(params);
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

    render() {
        const { confirmLoading } = this.state;
        const { visible, types } = this.props
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
                    </Form>
                </div>
            </Modal>
            </div>
        )
    }
}

export default Form.create()(ModelModal);