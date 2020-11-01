import React,{ Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Model } from "../../../dataModule/testBone";
import './style.less'
import { equipmentCalibration } from '../../../dataModule/UrlList'

const model = new Model();

class AddCalibration extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            actual_value: '',
            calibrate_compensation:'',
            sensor_id: this.props.sensor_id
        }
    }

    addCalibration(params) {
        let me = this;
        model.fetch(
          params,
          equipmentCalibration,
          'post',
          function() {
            me.props.cancel(false)
            me.setState({
                confirmLoading: false,
            })
            const NewParams = me.props.getparams()
            me.props.getCurrentPage(NewParams)
            message.success('标定记录增加成功')
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
        if(this.state.actual_value === '') return;
        let params = {
            actual_value: this.state.actual_value,
            calibrate_compensation: this.state.calibrate_compensation,
            sensor_id: this.props.sensor_id
        }
        this.setState({
          confirmLoading: true,
        });
        this.addCalibration(params);
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

    render() {
        const { visible } = this.props;
        const { confirmLoading, calibrate_compensation, actual_value } = this.state;
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
                title="增加标定值"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                >
                <div>
                    <Form { ...formItemLayout }>
                        <Form.Item
                            label="标定实际值"
                            colon
                        >
                        <Input  name="actual_value" onChange={this.changeValue} value={actual_value} />
                        </Form.Item>

                        <Form.Item
                            label="标定补偿值"
                            colon
                        >
                        <Input  name="calibrate_compensation" onChange={this.changeValue} value={calibrate_compensation} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}
export default Form.create()(AddCalibration);
