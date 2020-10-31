import React,{ Component } from 'react';
import { Modal, Form, Input, DatePicker, message, Select  } from 'antd';
import { Model } from "../../../dataModule/testBone";
import './style.less'
import { enginInfoUrl } from '../../../dataModule/UrlList'
import moment from 'moment';

const model = new Model();

class EditModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            engine_name: '',
            // begin_time:'',
            end_time: null,
            note: '',
            status:  '',
            url: '',
            aid: '', 
            isStopProduction: false,
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.editInfo !== prevProps.editInfo){
            let editInfo = this.props.editInfo;
            this.setState({
                aid: editInfo.key,
                engine_name: editInfo.engine_name,
                status: editInfo.status,
                note: editInfo.note === null ? '': editInfo.note,
                end_time: editInfo.end_time ===null ? null : editInfo.end_time,
                url: `${enginInfoUrl}${editInfo.key}/`
            })
            console.log(this.props.editInfo);
            if(editInfo.status === '停产'){
                this.setState({
                    isStopProduction: true,
                })
            }else{
                this.setState({
                    isStopProduction: false,
                })
            }
        }
    }

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
            message.success('编辑成功');
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
        if(this.state.engine_name === '') return;
        if(this.state.isStopProduction === true){
            if(this.state.end_time === null) return;
        }

        let params = {
            engine_name: this.state.engine_name,
            end_time: this.state.end_time,
            status: this.state.status,
            note: this.state.note
        }
        this.setState({
          confirmLoading: true,
        });
        this.editEngineInfo(params);
        this.props.afterCreateOrCreate();
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
    
    getStartDate = (date, dateString) => {
        this.setState({
            begin_time:dateString
        })
    } 

    getEndDate = (date, dateString) => {
        this.setState({
            end_time:dateString
        })
    }

    handleSelect = (string) => {
        this.setState({
            status: string
        })
        if(string === '停产'){
            this.setState({
                isStopProduction: true,
            })
        }else{
            this.setState({
                isStopProduction: false,
            })
        }
    }

    render() {

        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { confirmLoading, engine_name, note, end_time, status, isStopProduction } = this.state;
        const { Option } = Select;
        const formItemLayout = {
            labelCol: {
              span: 6
            },
            wrapperCol: {
              span: 16,
            },
          };

        return (
        <div>
            <Modal
                title="主机编辑"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                >
                <div>
                    <Form { ...formItemLayout } ref='engineForm' onSubmit={ this.onSubmit }>
                        <Form.Item
                            label="主机名称"
                            colon
                        >
                            {getFieldDecorator('engine_name', {
                                rules: [{ required: true, message: '请输入主机名称' }],
                                initialValue: engine_name
                            })(
                                <Input name="engine_name" disabled onChange={this.handleChange} />
                            )}
                        </Form.Item>


                        <Form.Item
                            label="状态"
                            colon
                        >
                        <Select name='' defaultValue={status} style={{ width: 120 }} onSelect={(string) => this.handleSelect(string)}>
                            <Option value="在产">在产</Option>
                            <Option value="停产">停产</Option>
                        </Select>
                        </Form.Item>

                        {isStopProduction ? 
                        <Form.Item
                            label="结束生产日期"
                            colon
                        >
                            {getFieldDecorator('end_time', {
                                initialValue: end_time === null ? null : moment(end_time,  'YYYY-MM-DD'),
                                rules: [{ required: true, message: '请选择停产日期' }],
                            })(
                                <DatePicker className="date" onChange={this.getEndDate} />
                            )}
                        </Form.Item> : null}

                        <Form.Item
                            label="备注"
                            colon
                        >
                            {getFieldDecorator('note', {
                                initialValue: note===undefined? '': note  
                            })(
                                <Input  name="note" onChange={this.handleChange}/>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
        )
    }
}

export default Form.create()(EditModal);
