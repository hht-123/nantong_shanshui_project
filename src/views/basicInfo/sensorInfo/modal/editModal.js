import React,{ Component } from 'react';
import { Modal, Form, Input, message, Select  } from 'antd';
import { Model } from '../../../../dataModule/testBone';

const model = new Model();
class EditModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            sensor_code: '',
            note:'',
            status: '',
            url: ''
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.editInfo !== prevProps.editInfo){
            let editInfo = this.props.editInfo;
            this.setState({
                sensor_code: editInfo.sensor_code,
                status: editInfo.status,
                note: editInfo.note === undefined? '':editInfo.note,
                // url: `${enginInfoUrl}${editInfo.key}/`
            })
        }
    }

    editEngineInfo(params) {
        let me = this;
        model.fetch(
          params,
          me.state.url,
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
        let params = {
            sensor_code: this.state.sensor_code,
            status: this.state.status,
            note: this.state.note
        }
        this.setState({
          confirmLoading: true,
        });
        this.editEngineInfo(params);
        window.location.reload()
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
                        <Select name='' defaultValue="在产" style={{ width: 120 }} onSelect={(string) => this.handleSelect(string)}>
                            <Option value="在产">在产</Option>
                            <Option value="停产">停产</Option>
                        </Select>
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