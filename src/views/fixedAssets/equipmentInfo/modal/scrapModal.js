import React,{ Component } from 'react';
import { Modal, Form,  message,  DatePicker  } from 'antd';
import { Model } from "../../../../dataModule/testBone";
import '../style.less'
import {ScrapEquipmentUrl} from '../../../../dataModule/UrlList'
const model = new Model();

class ScrapModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            applicant_time:'',
            approval_time: '',
            applicant: '',
            applicant_tel: '',
            applicant_departmen: '',
            scrapping_reasons: '',
            opinion: '',
            sign: '',
            remark: '',
        }
    }

    scrapEquipment(params) {
        let me = this;
        model.fetch(
          params,
          ScrapEquipmentUrl,
          'post',
          function() {
            me.props.closeModal(false)
            me.setState({
                confirmLoading: false,
            })
            message.success('提交成功')
          },
          function() {
            message.warning('提交失败，请重试')
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
        // if(this.state.maintain_cause === '') return;
        let params = {
            applicant_time:this.state.applicant_time,
            approval_time: this.state.approval_time,
            applicant: this.state.applicant,
            applicant_tel:this.state.applicant_tel ,
            applicant_department:this.state.applicant_department ,
            scrapping_reasons:this.state.scrapping_reasons ,
            opinion: this.state.opinion,
            sign:this.state.sign ,
            remark: this.state.remark,
            equipment_id: this.props.data.key,
            equipment_remark: this.props.data.note,
            host_name: this.props.data.engine_name,
            host_number: this.props.data.engine_code,
            store: this.props.data.store,
            location: this.props.data.location
        }
        this.setState({
          confirmLoading: true,
        });
        console.log(params);
        this.scrapEquipment(params);
      };
    
    //取消按钮事件
    handleCancel = () => {
        this.props.closeModal()
    };

    //改变input框值
    changeValue = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChange1 = (date, dateString) => {
        this.setState({
            applicant_time: dateString
        })
    }
    
    onChange2 = (date, dateString) => {
        this.setState({
            approval_time: dateString
        })
    }

    render() {
        const { visible } = this.props;
        const { confirmLoading } = this.state;
        
        return (
        <div>
            <Modal
                title="设备报废单填写"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                width='600px'
                >
                <div >
                        <table className='scrapTable' border="1" width='550px' height='400px' >
                        <thead>
                            <tr>
                                <th colSpan='4'>设备报废单</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>主机编号：</td>
                                <td >{this.props.data.engine_code}</td>
                                <td>主机名称：</td>
                                <td>{this.props.data.engine_name}</td>
                            </tr>
                            <tr>
                                <td>设备编号：</td>
                                <td colSpan='3'>{this.props.data.equipment_code}</td>
                            </tr>
                            <tr>
                                <td>仓库：</td>
                                <td>{this.props.data.storehouse}</td>
                                <td>库位：</td>
                                <td>{this.props.data.storage_location}</td>
                            </tr>
                            <tr>
                                <td>设备备注：</td>
                                <td colSpan='3'>{this.props.data.note}</td>
                            </tr>
                            <tr>
                                <td>申请人：</td>
                                <td>
                                    <input 
                                        name='applicant'  
                                        onChange={this.changeValue}
                                        className='inputNOborder'
                                        style={{height:30}}
                                    />
                                </td>
                                <td>申请人电话：</td>
                                <td>
                                    <input 
                                        name='applicant_tel'  
                                        onChange={this.changeValue} 
                                        className='inputNOborder'
                                        style={{border:0, height:30}}
                                    />
                                </td>
                            </tr>
                            <tr >
                                <td rowSpan='2'>报废原因：</td>
                                <td colSpan='3' rowSpan='2'>
                                    <textarea 
                                        name='scrapping_reasons'  
                                        onChange={this.changeValue} 
                                        className='textareaNOborder'
                                     />
                                </td>
                            </tr>
                            <tr></tr>
                            <tr>
                                <td>备注:</td>
                                <td colSpan='3'>
                                    <input 
                                        name='remark'
                                        className='inputNOborder'  
                                        onChange={this.changeValue}  
                                    />
                                </td>
                            </tr>
                        </tbody>
                        </table>
                </div>
            </Modal>
        </div>
        )
    }
}

export default Form.create()(ScrapModal);