import React,{ Component } from 'react';
import { Modal, Form } from 'antd';

import ContactIndex from '../ContactMes/ContactIndex';

class ContactModal extends Component{
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false, 
        }
    }

    handleOk = () => {
        const {validateFields} = this.props.form; 
        validateFields();          //校验并获取一组输入域的值
    };

    //取消按钮事件
    handleCancel = () => {
        this.props.cancel(false)
    };
        
    render(){
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
                title="联系人信息"
                visible={this.props.visible}               //对话框是否可见  这个地方通过this.props.Visible 接收到父组件传过来的Visible
                confirmLoading={confirmLoading}           
                onCancel={this.handleCancel}                //点击遮罩层或右上角叉或取消按钮的回调
                destroyOnClose={true}                //关闭时销毁 Modal 里的子元素  默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
                width='85%'
                footer={null}
            >
                <div>      {/* formItemLayout标签布局 */}                                 
                    <Form {...formItemLayout}  ref='customerForm' onSubmit={this.onSubmit}>
                           <ContactIndex client_id={this.props.client_id} />
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}

export default Form.create()(ContactModal);