import React,{ Component } from 'react';
import { Modal, Form, Input  } from 'antd';

class EditMesModal extends Component{
  constructor(props) {
    super (props);
    this.state = {
        confirmLoading: false,
        note:'',
        url: '',
        aid: '',  
    }
}

  render(){
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


    return(
      <div>
            <Modal
              title="修改设备报废信息"
              visible={visible}               //对话框是否可见  这个地方通过this.props.Visible 接收到父组件传过来的Visible
              onOk={this.handleOk}                      //点击确定回调
              confirmLoading={confirmLoading}            //确定按钮 loading
              onCancel={this.handleCancel}                //点击遮罩层或右上角叉或取消按钮的回调
              destroyOnClose={true}            //关闭时销毁 Modal 里的子元素  默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
            >
            <div>      {/* formItemLayout标签布局 */}                                 
                <Form {...formItemLayout}  ref='equipmentForm' onSubmit={this.onSubmit}>
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

export default  EditMesModal;