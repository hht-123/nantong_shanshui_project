import React,{ Component } from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
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
        }
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getStartDate = this.getStartDate.bind(this);
        this.getEndDate = this.getEndDate.bind(this);
    }

    createNewEngine(params) {
        for (let i in params) {
          if (params[i] === null) {
            params[i] = ''
          }
        }
        let me = this;
        model.fetch(
          params,
          me.state.url,
          'post',
          function(response) {
            if (me.state.whetherTest === false) {
              me.setState({
                isLoading: false,
                total: response.data.count,
                data: response.data.data,
                currentPage: params['currentPage']
              })
            } else {
              me.setState({
                isLoading: false,
                data: response.data.data,
              })
            }
          },
          function() {
            message.warning('加载失败，请重试')
          },
          this.state.whetherTest
        )
      }

    handleOk(e) {
        console.log(e);
        this.setState({
          confirmLoading: true,
        });
        
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
          this.props.cancel(false)
        }, 500);
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
        
          console.log(this.state);
        return (
        <div>
            <Modal
                title="新增主机"
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
                destroyOnClose={true}
            >
                <div>
                    <Form {...formItemLayout}>
                        <Form.Item
                            label="主机名称"
                            colon
                        >
                        <Input  name="engine_name" onChange={this.handleChange} value={engine_name}/>
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

export default AddModal;
