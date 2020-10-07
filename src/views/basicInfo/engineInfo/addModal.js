import React,{ Component } from 'react';
import { Modal, Form, Input, DatePicker, message, Button} from 'antd';
import { Model } from "../../../dataModule/testBone";

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
            url: 'main_engine/'   
        }
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getStartDate = this.getStartDate.bind(this);
        this.getEndDate = this.getEndDate.bind(this);
    }

    createNewEngine(params) {
        let me = this;
        model.fetch(
          params,
          me.state.url,
          'post',
          function() {
            me.props.cancel(false)
            me.setState({
                confirmLoading: false,
            })
          },
          function() {
            message.warning('发送数据失败，请重试')
          },
          this.props.whetherTest 
        )
      }

    handleOk() {
        const {validateFields} = this.props.form;
        validateFields();
        if(this.state.engine_name === '') return
        let params = {
            engine_name: this.state.engine_name,
            begin_time: this.state.begin_time,
            end_time: this.state.end_time,
            note: this.state.note
        }
        this.setState({
          confirmLoading: true,
        });
        this.createNewEngine(params)
      };
    
    //取消按钮事件
    handleCancel() {
        this.props.cancel(false)
    };

    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    
    getStartDate(date, dateString) {
        this.setState({
            begin_time:dateString
        })
    } 

    getEndDate(date, dateString) {
        this.setState({
            end_time:dateString
        })
    }


    render() {
        
        const {visible} = this.props;
        const { getFieldDecorator } = this.props.form;
        const {confirmLoading, engine_name, note} = this.state;
        console.log(this.state);
        
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
                visible={visible}
                confirmLoading={confirmLoading}
                destroyOnClose={true}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                <div>
                    <Form {...formItemLayout} ref='engineForm' onSubmit={this.onSubmit}>
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
                        <DatePicker name="begin_time" style={{width: '315px'}} onChange={this.getStartDate}/>
                        </Form.Item>

                        <Form.Item
                            label="结束生产日期"
                            colon
                        >
                        <DatePicker style={{width: '315px'}}  onChange={this.getEndDate}/>
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
