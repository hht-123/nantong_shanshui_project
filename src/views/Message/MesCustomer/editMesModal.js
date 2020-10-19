import React,{ Component } from 'react';
import { Modal, Form, Input, message  } from 'antd';
import { Model } from "../../../dataModule/testBone";
import { messageCUrl } from '../../../dataModule/UrlList';

const model = new Model();

class EditMesModal extends Component{
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            client_code:'',
            client_unit:'',
            client_address:'',
            client_zip_code:'',
            client_industry:'',
            unit_phone:'',
            unit_fax:'',
            region:'',
            note:'',
            url: '',
            aid: '',  
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.editInfo !== prevProps.editInfo){
            let editInfo = this.props.editInfo;
            this.setState({
                aid: editInfo.key,
                client_unit:editInfo.client_unit,
                client_address:editInfo.client_address,
                client_zip_code:editInfo.client_zip_code,
                client_industry:editInfo.client_industry,
                unit_phone:editInfo.unit_phone,
                unit_fax:editInfo.unit_fax,
                region:editInfo.region,
                note: editInfo.note === undefined? '':editInfo.note,
                url: `${messageCUrl}${editInfo.key}/`
            })
        }
    }

    //修改完以后，提交数据
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
        if(this.state.client_unit === '') return
        let params = {
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
        this.editEngineInfo(params);
        window.location.reload()
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

    render(){
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, 
                client_unit,
                client_address,
                client_zip_code,
                client_industry,
                unit_phone,
                unit_fax,
                region,
                note
                } = this.state;
       
        const formItemLayout = {
            labelCol: {
              span: 5
            },
            wrapperCol: {
              span: 16,
            },
          };

        return(
            <div>
            <Modal
                title="修改客户信息"
                visible={visible}               //对话框是否可见  这个地方通过this.props.Visible 接收到父组件传过来的Visible
                onOk={this.handleOk}                      //点击确定回调
                confirmLoading={confirmLoading}            //确定按钮 loading
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
                            initialValue: client_unit
                        })(
                            <Input  name="client_unit" onChange={this.handleChange} /> //onChange	输入框内容变化时的回调 value	输入框内容
                        )}
                        </Form.Item>

                        <Form.Item
                            label="客户地址"
                            colon
                        > 
                            {getFieldDecorator('client_address', {            
                            initialValue: client_address
                        })(
                            <Input  name="client_address" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                            label="客户邮编"
                            colon
                        >
                        {getFieldDecorator('client_zip_code', {            
                            initialValue: client_zip_code
                        })(
                            <Input  name="client_zip_code" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                            label="客户行业"
                            colon
                        >
                        {getFieldDecorator('client_industry', {            
                            initialValue: client_industry
                        })(
                            <Input  name="client_industry" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                            label="单位电话"
                            colon
                        >
                        {getFieldDecorator('unit_phone', {            
                            initialValue: unit_phone
                        })(
                            <Input  name="unit_phone" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                        label="单位传真"
                        colon
                        >
                        {getFieldDecorator('unit_fax', {            
                            initialValue:unit_fax
                        })(
                            <Input  name="unit_fax" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                        label="客户省份"
                        colon
                        >
                        {getFieldDecorator('region', {
                            initialValue:region
                        })(
                            <Input  name="region" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            colon
                        >
                        {getFieldDecorator('note', {
                            initialValue:note
                        })(
                            <Input  name="note" onChange={this.handleChange}  />
                        )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}

export default  Form.create()(EditMesModal);

