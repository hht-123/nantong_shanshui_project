import React,{ Component } from 'react';
import { Modal, Form, Input, message} from 'antd';

import {Model} from '../../../dataModule/testBone';
import {messageCUrl} from '../../../dataModule/UrlList';
const model = new Model();

class AddMesCustomer extends Component{
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            client_unit: '',
            client_address: '',
            client_zip_code: '',
            client_industry: '',
            unit_phone: '',
            unit_fax: '',
            note: '',  
        }
    }

    //fetch函数进行数据传输,fetch在reactjs中等同于 XMLHttpRequest
    createNewCustomer(params) {
        let me = this;
        model.fetch(
          params,
          messageCUrl,
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
        if(this.state.client_unit === '') return;
        const params = {
            client_code:this.state.client_code,
            client_unit:this.state.client_unit,
            client_address:this.state.client_address,
            client_zip_code:this.state.client_zip_code,
            client_industry:this.state.client_industry,
            unit_phone:this.state.unit_phone,
            unit_fax:this.state.unit_fax,
            region:this.state.region,
            note: this.state.note
        }
        this.setState({
            confirmLoading: true,
        });
            console.log(params);
            this.createNewCustomer(params);
            let item = this.props.getParams();
            this.props.getCurrentPage(item); 
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
        
    render(){
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, } = this.state;

        
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
                confirmLoading={confirmLoading}           
                onCancel={this.handleCancel}                //点击遮罩层或右上角叉或取消按钮的回调
                destroyOnClose={true}                //关闭时销毁 Modal 里的子元素  默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
            >
                <div>      {/* formItemLayout标签布局 */}                                 
                    <Form {...formItemLayout}  ref='customerForm' onSubmit={this.onSubmit}>

                        <Form.Item
                            label="客户单位"
                            colon
                        >
                            {getFieldDecorator('client_unit', {
                            rules: [{ required: true, message: '请输入客户单位' }],            //getFieldDecorator()  自定义校验方法,设置此项为必填项
                        })(
                            <Input  name="client_unit" onChange={this.handleChange} /> //onChange	输入框内容变化时的回调 value	输入框内容
                        )}
                        </Form.Item>

                        <Form.Item
                            label="客户地址"
                            colon
                        >
                            {getFieldDecorator('client_address', {
                                rules: [{ required: true, message: '请输入客户地址' }],            //getFieldDecorator()  自定义校验方法,设置此项为必填项
                            })(
                                <Input  name="client_address" onChange={this.handleChange} />
                            )}      
                        </Form.Item>

                        <Form.Item
                            label="客户邮编"
                            colon
                        >
                        <Input  name="client_zip_code" onChange={this.handleChange} />
                        </Form.Item>

                        <Form.Item
                            label="客户行业"
                            colon
                        >
                            {getFieldDecorator('client_industry', {
                                rules: [{ required: true, message: '请输入客户行业' }],            //getFieldDecorator()  自定义校验方法,设置此项为必填项
                            })(
                                <Input  name="client_industry" onChange={this.handleChange} />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="单位电话"
                            colon
                        >
                            {getFieldDecorator('unit_phone', {
                                rules: [{ required: true, message: '请输入客户电话' }],            //getFieldDecorator()  自定义校验方法,设置此项为必填项
                            })(
                                <Input  name="unit_phone" onChange={this.handleChange} />
                            )}
                        </Form.Item>

                        <Form.Item
                        label="单位传真"
                        colon
                        >
                        <Input  name="unit_fax" onChange={this.handleChange} />
                        </Form.Item>

                        <Form.Item
                        label="客户省份"
                        colon
                        >
                        {getFieldDecorator('region', {
                            rules: [{ required: true, message: '请输入客户省份' }],            //getFieldDecorator()  设置此项为必填项
                        })(
                        <Input  name="region" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            colon
                        >
                        <Input  name="note" onChange={this.handleChange}  />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}


export default Form.create()(AddMesCustomer);