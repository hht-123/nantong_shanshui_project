import React,{ Component } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import { Model } from "../../../dataModule/testBone";
import './style/equipmentMaintenance.less';
import { addEquipMaintainUrl } from '../../../dataModule/UrlList'

const model = new Model();
const { Option } = Select;

class AddModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            maintain_cause: '',
            fault_description:'',
            equipment_id: this.props.equipment_id,
        }
    }

    createNewEngine(params) {
        let me = this;
        model.fetch(
          params,
          addEquipMaintainUrl,
          'post',
          function() {
            me.props.cancel(false)
            me.setState({
                confirmLoading: false,
            })
            const NewParams = me.props.getparams()
            me.props.getCurrentPage(NewParams)
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

    handleOk = () => {
        const {validateFields} = this.props.form;
        validateFields();
        // if(this.state.maintain_cause === '') return;
        let params = {
            equipment_id: this.state.equipment_id,
            maintain_cause: this.state.maintain_cause,
            fault_description: this.state.fault_description
        }
        this.setState({
          confirmLoading: true,
        });
        this.createNewEngine(params);
      };
    
    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    };

    //改变input框值
    changeValue = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    //下拉框的选择
    handleChange = (value) => {
        console.log(value)
        this.setState({
            maintain_cause: value
        })
    }

    render() {
        const allowClear = true
        const { visible } = this.props;
        const { confirmLoading, fault_description } = this.state;
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
                title="设备报修"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                >
                <div>
                    <Form { ...formItemLayout }>
                        <Form.Item
                            label="维护原因"
                            colon
                        >
                        <Select  allowClear={ allowClear }  style={{ width: 120, }} onChange={ this.handleChange } >
                            <Option value="0">例行维护</Option>
                            <Option value="1">用户报修</Option>
                            <Option value="2">运维报修</Option>
                        </Select>
                        </Form.Item>

                        <Form.Item
                            label="设备状况描述"
                            colon
                        >
                        <Input  name="fault_description" onChange={this.changeValue} value={fault_description} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}

export default Form.create()(AddModal);