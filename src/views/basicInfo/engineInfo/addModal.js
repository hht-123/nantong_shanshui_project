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
            begin_time:'',
            end_time:'',
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
        if(this.state.engine_name === '') return;
        let params = {
            engine_name: this.state.engine_name,
            begin_time: this.state.begin_time,
            end_time: this.state.end_time,
            status: '123123',
            note: this.state.note
        }
        this.setState({
          confirmLoading: true,
        });
        this.createNewEngine(params);
<<<<<<< HEAD
        this.props.getCurrentPage({currentPage: 1, size: 10});
      };
=======
        window.location.reload();
    };
>>>>>>> b681684133a82f1bb335cd011461a399f5fab0ab
    
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

    render() {
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, note } = this.state;
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
                title="新增主机"
                visible={ visible }
                confirmLoading={ confirmLoading }
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
                        <DatePicker className='date' onChange={this.getStartDate}/>
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
