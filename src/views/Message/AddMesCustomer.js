import React,{ Component } from 'react';
import { Modal, Form, Input,  message } from 'antd';

import {Model} from '../../dataModule/testBone';
const model = new Model();

class AddMesCustomer extends Component{
    constructor(props) {
        super (props);
        this.state = {
            visible: false,
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
        this.handleChange = this.handleChange.bind(this);
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
        validateFields();
        if(this.state.client_unit === '') return
        let params = {
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
    handleCancel = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      };

    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
        
    render(){
        
        const {confirmLoading, 
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
              span: 5
            },
            wrapperCol: {
              span: 16,
            },
        };
        
          console.log(this.state);
        return(
            <div>
            <Modal
                title="新增客户信息"
                visible={this.state.visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                destroyOnClose={true}
            >
                <div>                                       
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
                        <Input  name="client_unit" onChange={this.handleChange} value={client_unit}/>
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
                        <Input  name="client_province" onChange={this.handleChange} value={client_province}/>
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