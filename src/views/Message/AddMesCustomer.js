import React,{ Component } from 'react';
import { Modal, Form, Input, message} from 'antd';

import {Model} from '../../dataModule/testBone';
const model = new Model();

class AddMesCustomer extends Component{
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            client_code: '',
            client_unit:'',
            client_address:'',
            client_zip_code:'',
            client_industry:'',
            unit_phone:'',
            unit_fax:'',
            note:'',  
            url:'add_mes/' 
        }
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        //this.handleChange = this.handleChange.bind(this);
    }

        //fetch函数进行数据传输,fetch在reactjs中等同于 XMLHttpRequest
    createNewCuster(params) {
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
            message.warning('加载失败，请重试')
          },
          this.props.whetherTest
        )
    }


    handleOk(e) {
        const {validateFields} = this.props.form; 

        validateFields();          //校验并获取一组输入域的值
        if(this.state.client_unit === '') return
        const params = {
            client_code:this.state.client_code,
            client_unit:this.state.client_unit,
            client_address:this.state.client_address,
            client_zip_code:this.state.client_zip_code,
            client_industry:this.state.client_industry,
            unit_phone:this.state.unit_phone,
            unit_fax:this.state.unit_fax,
            client_province:this.state.client_province,
            note: this.state.note
        }
        this.setState({
            confirmLoading: true,
        });
        this.createNewCuster(params)
    };

    //取消按钮事件
    handleCancel() {
        this.props.cancel(false)
    };

    andleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
        
    render(){
        const { getFieldDecorator } = this.props.form;
        const {
            confirmLoading, 
            client_code,
            client_unit,
            client_address,
            client_zip_code,
            client_industry,
            client_province,
            unit_phone,
            unit_fax,
            note} = this.state;
        console.log(this.state);
        
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
                destroyOnClose={true}                //关闭时销毁 Modal 里的子元素         默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
            >
                <div>      {/* formItemLayout标签布局 */}                                 
                    <Form {...formItemLayout}  ref='customerForm' onSubmit={this.onSubmit}>
                        <Form.Item
                            label="客户编号"
                            colon
                        >
                        <Input  name="client_code" onChange={this.handleChange} value={client_code}/>      
                        </Form.Item>
                        <Form.Item
                            label="客户单位"
                            colon
                        >
                            {getFieldDecorator('client_unit', {
                            rules: [{ required: true, message: '请输入客户单位' }],            //getFieldDecorator()  自定义校验方法,设置此项为必填项
                        })(
                            <Input  name="client_unit" onChange={this.handleChange} value={client_unit}/> //onChange	输入框内容变化时的回调 value	输入框内容
                        )}
                        </Form.Item>
                        <Form.Item
                            label="客户地址"
                            colon
                        >
                        <Input  name="client_address" onChange={this.handleChange} value={client_address}/>
                        </Form.Item>
                        <Form.Item
                            label="客户邮编"
                            colon
                        >
                        <Input  name="client_zip_code" onChange={this.handleChange} value={client_zip_code}/>
                        </Form.Item>
                        <Form.Item
                            label="客户行业"
                            colon
                        >
                        <Input  name="client_industry" onChange={this.handleChange} value={client_industry}/>
                        </Form.Item>
                        <Form.Item
                            label="单位电话"
                            colon
                        >
                        <Input  name="unit_phone" onChange={this.handleChange} value={unit_phone}/>
                        </Form.Item>
                        <Form.Item
                        label="单位传真"
                        colon
                        >
                        <Input  name="unit_fax" onChange={this.handleChange} value={unit_fax}/>
                        </Form.Item>
                        <Form.Item
                        label="客户省份"
                        colon
                        >
                        {getFieldDecorator('client_province', {
                            rules: [{ required: true, message: '请输入客户省份' }],            //getFieldDecorator()  设置此项为必填项
                        })(
                        <Input  name="client_province" onChange={this.handleChange} value={client_province}/>
                        )}
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


export default Form.create()(AddMesCustomer);