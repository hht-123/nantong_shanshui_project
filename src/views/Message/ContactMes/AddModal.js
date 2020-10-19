import React,{ Component } from 'react';
import { Modal, Form, Input, message} from 'antd';

import {Model} from '../../../dataModule/testBone';
import {contactUrl} from '../../../dataModule/UrlList';
const model = new Model();

class Addcontact extends Component{
    constructor(props) {
        super (props);
        this.state = {
          confirmLoading: false,
          contact_person:'',
          contact_position:'',
          contact_tel:'',
          note: '',  
          client_id: this.props.client_id,
        }
    }

    //fetch函数进行数据传输,fetch在reactjs中等同于 XMLHttpRequest
    createNewContact = (params) => {
        let me = this;
        model.fetch(
          params,
          contactUrl,
          'post',
          function() {
            me.props.cancel(false)
            me.setState({
                confirmLoading: false,
            })
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
        validateFields();          //校验并获取一组输入域的值
        if( this.state.contact_person === '' ) return;
        const params = {
            contact_person: this.state.contact_person,
            contact_position: this.state.contact_position,
            contact_tel: this.state.contact_tel,
            note: this.state.note,
            client_id: this.state.client_id
        }
        this.setState({
            confirmLoading: true,
        });
            this.createNewContact(params);
            console.log(params)
            let item = this.props.getParams();
            this.props.getCurrentPage(item);
    };

    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    };
        
    //输入框内容保存
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
        
    render(){
        const { getFieldDecorator } = this.props.form;
        const { 
          confirmLoading, 
          contact_person,
          contact_position,
          contact_tel,
          note} = this.state;
        // console.log(this.state);
        
        const formItemLayout = {
            labelCol: {
              span: 5      //左边留白大小
            },
            wrapperCol: {
              span: 16,          // 内容区大小（两者和不能!>24
            },
        };
        
        return(
            <div>
            <Modal
                title="新增客户信息"
                visible={this.props.Visible}               //对话框是否可见  这个地方通过this.props.Visible 接收到父组件传过来的Visible
                onOk={this.handleOk}                      //点击确定回调
                confirmLoading={confirmLoading}            //确定按钮 loading
                onCancel={this.handleCancel}                //点击遮罩层或右上角叉或取消按钮的回调
                destroyOnClose={true}                //关闭时销毁 Modal 里的子元素  默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
            >
                <div>      {/* formItemLayout标签布局 */}                                 
                    <Form {...formItemLayout}  ref='contactForm' onSubmit={this.onSubmit}>

                        <Form.Item
                            label="联系人"
                            colon
                        >
                            {getFieldDecorator('contact_person', {
                            rules: [{ required: true, message: '请输入联系人' }],            //getFieldDecorator()  自定义校验方法,设置此项为必填项
                        })(
                            <Input  name="contact_person" onChange={this.handleChange} value={contact_person}/> //onChange	输入框内容变化时的回调 value	输入框内容
                        )}
                        </Form.Item>

                        <Form.Item
                            label="联系人职位"
                            colon
                        >
                            {getFieldDecorator('contact_position', {
                                rules: [{ required: true, message: '请输入联系人职位' }],
                            })(
                                <Input  name="contact_position" onChange={this.handleChange} value={contact_position}/>
                            )}
                        </Form.Item>
                        

                        <Form.Item
                            label="联系人电话"
                            colon
                        >
                            {getFieldDecorator('contact_tel', {
                                rules: [{ required: true, message: '请输入联系人电话' }],
                            })(
                                <Input  name="contact_tel" onChange={this.handleChange} value={contact_tel}/>
                            )}
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            colon
                        >
                        <Input  name="note" onChange={this.handleChange} value={note}/>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}


export default Form.create()(Addcontact);