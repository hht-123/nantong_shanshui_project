import React,{ Component } from 'react';
import { Modal, Form, Input, DatePicker, message, Select  } from 'antd';
import { Model } from "../../../dataModule/testBone";
import './style/equipmentMaintenance.less'
import { addEquipMaintainUrl} from '../../../dataModule/UrlList'

const model = new Model();

class EditModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            maintain_time: '',
            fault_description:'',
            maintain_result: '1',
            maintain_status: '1',
            responsible_person: '',
            aid: '',  
            url: '',
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.editInfo !== prevProps.editInfo){
            let editInfo = this.props.editInfo;
            this.setState({
                aid: editInfo.key,
                maintain_time: editInfo.maintain_time,
                fault_description: editInfo.fault_description === undefined ? '':editInfo.fault_description,
                responsible_person: editInfo.responsible_person === undefined ? '':editInfo.responsible_person,
                url: `${addEquipMaintainUrl}${editInfo.key}/`
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
            let NewParams = me.props.getparams()
            me.props.getCurrentPage(NewParams)
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
        const {validateFields} = this.props.form;
        validateFields();
        // if(this.state.maintain_time === '') return
        let params = {
            maintain_time: this.state.maintain_time,
            maintain_result: this.state.maintain_result,
            maintain_status: this.state.maintain_status,
            responsible_person: this.state.responsible_person,
            fault_description: this.state.fault_description
        }
        this.setState({
          confirmLoading: true,
        });
        this.editEngineInfo(params);
      };
    
    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    getDate = (date, dateString) => {
        this.setState({
            maintain_time:dateString
        })
    }

    //设备状态下拉框值改变时触发的函数
    ChangeValue1 = (value) => {
        // console.log(value);
        this.setState({
            maintain_result: value
        })
    }
    ChangeValue2 = (value) => {
        // console.log(value);
        this.setState({
            maintain_status: value
        })
    }

    render() {

        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, fault_description, responsible_person } = this.state;
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
                title="设备维护编辑"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                >
                <div>
                    <Form { ...formItemLayout } ref='engineForm' onSubmit={ this.onSubmit }>
                        <Form.Item
                            label="维护时间"
                            colon
                        >
                            <DatePicker className="maintain_time" onChange={this.getDate} />
                        </Form.Item>

                        <Form.Item
                            label="设备状况描述"
                            colon
                        >
                            {getFieldDecorator('fault_description', {
                                initialValue: fault_description === undefined ? '': fault_description 
                            })(
                                <Input  name="fault_description" onChange={this.handleChange}/>
                            )}
                        </Form.Item>

                        {/* <Form.Item
                            label="维护结果"
                            colon
                        >
                        <Select name='maintain_result' placeholder="是否维护" style={{ width: 120 }} onChange={ this.ChangeValue1 }>
                            <Option value="1">维护完成</Option>
                            <Option value="-1">维护未完成</Option>
                        </Select>
                        </Form.Item> */}

                        <Form.Item
                            label="维护状态"
                            colon
                        >
                        <Select name='maintain_status' defaultValue="维护结束" style={{ width: 120 }} onChange={ this.ChangeValue2 } >
                            <Option value="1">维护结束</Option>
                            <Option value="0">维护未结束</Option>
                        </Select>
                        </Form.Item>

                        <Form.Item
                            label="负责人"
                            colon
                        >
                        {getFieldDecorator('responsible_person', {
                                initialValue: responsible_person === undefined ? '': responsible_person 
                        })(
                            <Input  name="responsible_person" onChange={this.handleChange}/>
                        )}  
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}

export default Form.create()(EditModal);
