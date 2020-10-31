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
            sensor_threshold: '',       //传感器阈值
            notice_content: '',         //提示内容
            default_compensation: '',   //默认补偿值
            note:'',
            sensorAid: '',
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.editInfo !== prevProps.editInfo){
            let editInfo = this.props.editInfo;
            console.log(this.props.editInfo)
            this.setState({
                sensorAid: editInfo.key,
                sensor_code: editInfo.sensor_code,
                status: editInfo.status,
                sensor_threshold: editInfo.sensor_threshold,
                notice_content: editInfo.notice_content,
                default_compensation: editInfo.default_compensation,
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
        const { status, sensor_threshold, notice_content, default_compensation, note, sensorAid} = this.state;
        const params = {
            status,
            sensor_threshold,
            notice_content,
            default_compensation,
            note,
        }
        console.log(params);
        this.setState({
          confirmLoading: true,
        });
        this.editEngineInfo(params, sensorAid);
        this.props.afterCreateOrEdit();
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
        const { confirmLoading, note } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { Option } = Select;
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
                    title="传感器信息修改"
                    visible={ visible }
                    confirmLoading={ confirmLoading }
                    destroyOnClose={ true }
                    onOk={ this.handleOk }
                    onCancel={ this.handleCancel }
                >
                <Form { ...formItemLayout } ref='engineForm' onSubmit={ this.onSubmit }>
                        <Form.Item
                            label="状态"
                            colon
                        >
                        <Select name='' defaultValue="可以使用" style={{ width: 120 }} onSelect={(string) => this.handleSelect(string)}>
                            <Option value="可以使用">可以使用</Option>
                            <Option value="停止使用">停止使用</Option>
                        </Select>
                        </Form.Item>

                        <Form.Item
                            label="补偿值"
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