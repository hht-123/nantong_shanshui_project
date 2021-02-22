import React,{ Component } from 'react';
import { Modal, Form, Input, message, Select  } from 'antd';
import { Model } from '../../../../dataModule/testBone';
import { addSensorUrl } from '../../../../dataModule/UrlList';

const model = new Model();
class EditModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            status: '',
            high_sensor_threshold: '',       //传感器下阈值
            down_sensor_threshold: '',       //传感器下阈值
            notice_content: '',         //提示内容
            default_compensation: '',   //默认补偿值
            note:'',
            sensorAid: '',
            theoretical_value: '',
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.editInfo !== prevProps.editInfo){
            let editInfo = this.props.editInfo;
            this.setState({
                sensorAid: editInfo.key,
                sensor_code: editInfo.sensor_code,
                status: editInfo.status,
                high_sensor_threshold: editInfo.high_sensor_threshold,
                down_sensor_threshold: editInfo.down_sensor_threshold,
                notice_content: editInfo.notice_content,
                default_compensation: editInfo.default_compensation,
                theoretical_value: editInfo.theoretical_value,
                note: editInfo.note === undefined? '':editInfo.note,
            })
        }
    }

    editEngineInfo(params, sensorAid) {
        for (let i in params) {
            if (params[i] === undefined || params[i] === null) {
                params[i] = ''
            }
        }
        let me = this;
        model.fetch(
          params,
          addSensorUrl+ sensorAid + '/',
          'put',
          function() {
            me.props.cancel(false)
            me.setState({
                confirmLoading: false,
            })
            me.props.afterCreateOrEdit();
          },
          function() {
            message.warning('修改失败，请重试')
            setTimeout(() => {
                me.setState({
                  confirmLoading: false,
                });
              }, 2000)
          },
          this.props.whetherTest 
        )
      }

    handleOk = () => {
        const { status, high_sensor_threshold, down_sensor_threshold, notice_content, default_compensation, note, sensorAid, theoretical_value} = this.state;
        const { validateFields } = this.props.form;
        validateFields();
        if(high_sensor_threshold === '' || down_sensor_threshold === '' || notice_content === '' || default_compensation=== '' || theoretical_value === '') return 
        const params = {
            status,
            theoretical_value,
            high_sensor_threshold,
            down_sensor_threshold,
            notice_content,
            default_compensation,
            note,
        }
        this.setState({
          confirmLoading: true,
        })
        // console.log(56, params)
        this.editEngineInfo(params, sensorAid);
      };

    //取消
    handleCancel = () => {
        this.props.cancel(false)
    };

    //更改
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    //选择
    handleSelect = (string) => {
        this.setState({
            status: string
        })
    }

    render() {
        const { visible } = this.props;
        const { confirmLoading, note, status, high_sensor_threshold, down_sensor_threshold, notice_content, default_compensation, theoretical_value } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { Option } = Select;
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
                    title="传感器信息修改"
                    visible={ visible }
                    confirmLoading={ confirmLoading }
                    destroyOnClose={ true }
                    onOk={ this.handleOk }
                    onCancel={ this.handleCancel }
                >
                <Form { ...formItemLayout } ref='engineForm' onSubmit={ this.onSubmit }>
                        { status !== '正在使用'  ? 
                            <Form.Item
                            label="状态"
                            colon
                        >
                            {getFieldDecorator('status', {
                                rules: [{ required: true}],
                                initialValue: status
                            })(
                                <Select  style={{ width: 120 }} onSelect={(string) => this.handleSelect(string)}>
                                    <Option value="未使用">未使用</Option>
                                    <Option value="报废">报废</Option>
                                </Select>
                            )}
                        </Form.Item> : null
                        }

                        <Form.Item
                            label="默认理论值"
                            colon
                        >
                            {getFieldDecorator('theoretical_value', {
                                rules: [{ required: true, message: '请添加传感器标定理论值' }],
                                initialValue: theoretical_value,
                            })(
                                <Input  name="theoretical_value" onChange={this.handleChange} />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="补偿值"
                            colon
                        >
                            {getFieldDecorator('default_compensation', {
                                rules: [{ required: true, message: '请添加传感器补偿值' }],
                                initialValue: default_compensation,
                            })(
                                <Input  name="default_compensation" onChange={this.handleChange} />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="传感器上阈值"
                            colon
                        >
                            {getFieldDecorator('high_sensor_threshold', {
                                rules: [{ required: true, message: '请添加传感器上阈值' }],
                                initialValue: high_sensor_threshold,
                            })(
                                <Input  name="high_sensor_threshold" onChange={this.handleChange} />
                            )}
                                
                        </Form.Item>

                        <Form.Item
                            label="传感器下阈值"
                            colon
                        >
                            {getFieldDecorator('down_sensor_threshold', {
                                rules: [{ required: true, message: '请添加传感器下阈值' }],
                                initialValue: down_sensor_threshold,
                            })(
                                <Input  name="down_sensor_threshold" onChange={this.handleChange} />
                            )}
                                
                        </Form.Item>

                        <Form.Item
                            label="提示内容"
                            colon
                        >
                            {getFieldDecorator('notice_content', {
                                rules: [{ required: true, message: '请添加提示内容' }],
                                initialValue: notice_content,
                            })(
                                <Input  name="notice_content" onChange={this.handleChange} />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            colon
                        >
                            {getFieldDecorator('note', {
                                initialValue: note===undefined? '': note  
                            })(
                                <Input  name="note" onChange={this.handleChange}/>
                            )}
                        </Form.Item>

                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(EditModal);