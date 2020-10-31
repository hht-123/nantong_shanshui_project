import React,{ Component } from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
import { Model } from "../../../dataModule/testBone";
import './style.less';
import { enginInfoUrl } from '../../../dataModule/UrlList'

const model = new Model();

class AddModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            engine_name: '',
            begin_time: null,
            end_time: null,
            note:'',
        }
    }

    createNewEngine(params) {
        let me = this;
        model.fetch(
          params,
          enginInfoUrl,
          'post',
          function() {
            me.props.cancel(false)
            me.setState({
                confirmLoading: false,
            })
            message.success("添加成功");
            me.afterClose();
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
        if(this.state.engine_name === '' || this.state.begin_time === '') return;
        let params = {
            engine_name: this.state.engine_name,
            begin_time: this.state.begin_time,
            end_time: this.state.end_time,
            status: '1',
            note: this.state.note
        }
        this.setState({
          confirmLoading: true,
        });
        this.createNewEngine(params);
        this.props.afterCreateOrCreate();   //创建完成后保持搜索条件
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
    
    getStartDate = (date, dateString) => {
        this.setState({
            begin_time: dateString
        })
    } 

    getEndDate = (date, dateString) => {
        this.setState({
            end_time: dateString
        })
    }

    //弹窗关闭后的清空
    afterClose = () => {
        this.setState({
            engine_name: '',
            begin_time: null,
            end_time: null,
            note:'',
        })
    }

    render() {
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, note } = this.state;
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
                title="新增主机"
                visible={ visible }
                confirmLoading={ confirmLoading }
                afterClose={ this.afterClose }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                >
                <div>
                    <Form { ...formItemLayout }>
                        <Form.Item
                            label="主机名称"
                            colon
                        >
                            {getFieldDecorator('engine_name', {
                                rules: [{ required: true, message: '请输入主机名称' }],
                            })(
                                <Input  name="engine_name" onChange={this.handleChange} />
                            )}
                        
                        </Form.Item>
                        
                        <Form.Item
                            label="开始生产日期"
                            colon
                        >
                            {getFieldDecorator('begin_time', {
                                rules: [{ required: true, message: '请选择开始生产日期' }],
                            })(
                                <DatePicker className='date' onChange={this.getStartDate}/>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="结束生产日期"
                            colon
                        >
                            <DatePicker className='date' onChange={this.getEndDate}/>
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            colon
                        >
                            <Input  name="note" onChange={this.handleChange} value={note} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}

export default Form.create()(AddModal);
