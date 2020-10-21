import React,{ Component } from 'react';
import { Modal, Form, Input, message  } from 'antd';
import { Model } from "../../../dataModule/testBone";
import { contactUrl } from '../../../dataModule/UrlList';

const model = new Model();

class EditModal extends Component{
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            contact_person:'',
            contact_position:'',
            contact_tel:'',
            remark:'',
            url: '',
            aid: '',  
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.editInfo !== prevProps.editInfo){
            let editInfo = this.props.editInfo;
            this.setState({
                aid: editInfo.key,
                contact_person:editInfo.contact_person,
                contact_position:editInfo.contact_position,
                contact_tel:editInfo.contact_tel,
                remark: editInfo.remark === undefined? '':editInfo.remark,
                url: `${contactUrl}${editInfo.key}/`
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
        if(this.state.contact_person === '') return
        let params = {
            contact_person:this.state.contact_person,
            contact_position:this.state.contact_position,
            contact_tel:this.state.contact_tel,
            remark:this.state.remark,
        }
        this.setState({
            confirmLoading: true,
        });
        this.editEngineInfo(params);
        let item = this.props.getParams();
        this.props.getCurrentPage(item);
    };
    
    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
        console.log(this.state)
    }

    render(){
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, 
                contact_person,
                contact_position,
                contact_tel,
                remark,
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
                title="编辑客户信息"
                visible={visible}               //对话框是否可见  这个地方通过this.props.Visible 接收到父组件传过来的Visible
                onOk={this.handleOk}                      //点击确定回调
                confirmLoading={confirmLoading}            //确定按钮 loading
                onCancel={this.handleCancel}                //点击遮罩层或右上角叉或取消按钮的回调
                destroyOnClose={true}                //关闭时销毁 Modal 里的子元素  默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
            >
                <div>      {/* formItemLayout标签布局 */}                                 
                    <Form {...formItemLayout}  ref='customerForm' onSubmit={this.onSubmit}>

                        <Form.Item
                            label="联系人"
                            colon
                        >
                            {getFieldDecorator('contact_person', {
                            initialValue: contact_person
                        })(
                            <Input  name="contact_person" onChange={this.handleChange} /> //onChange	输入框内容变化时的回调 value	输入框内容
                        )}
                        </Form.Item>

                        <Form.Item
                            label="联系人职位"
                            colon
                        > 
                            {getFieldDecorator('contact_position', {            
                            initialValue: contact_position
                        })(
                            <Input  name="contact_position" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                            label="联系人电话"
                            colon
                        >
                        {getFieldDecorator('contact_tel', {            
                            initialValue: contact_tel
                        })(
                            <Input  name="contact_tel" onChange={this.handleChange} />
                        )}
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            colon
                        >
                        {getFieldDecorator('remark', {            
                            initialValue: remark
                        })(
                            <Input  name="remark" onChange={this.handleChange} />
                        )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}

export default  Form.create()(EditModal);