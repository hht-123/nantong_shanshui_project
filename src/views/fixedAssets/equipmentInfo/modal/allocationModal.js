import React,{ Component } from 'react';
import { Modal, message,  DatePicker  } from 'antd';
import { Model } from "../../../../dataModule/testBone";
import '../style.less'
import { allcationEquipmentUrl } from '../../../../dataModule/UrlList'
const model = new Model();

class AllocationModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            applicant_time:'',          //申请时间
            approval_time: '',          //审批时间
            applicant: '',              //申请人
            applicant_tel: '',          //申请电话
            transfer_unit: '',          //调入单位
            transfer_unit_ads: '',      //调入单位地址
            transfer_unit_tel: '',      //调入单位电话
            client_id: '',              //客户编号
            allocation_reason: '',      //调拨原因
            transport_unit: '',         //运输单位
            agent: '',                  //经办人
            agent_tel: '',              //经办人电话
            opinion: '',                //主管意见
            sign: '',                   //主管签字
            remark: '',
        }
    }

    scrapEquipment(params) {
        let me = this;
        model.fetch(
          params,
          allcationEquipmentUrl,
          'post',
          function() {
            me.props.closeModal(false)
            me.setState({
                confirmLoading: false,
            })
            message.warning('提交成功')
          },
          function() {
            message.warning('提交失败，请重试')
            setTimeout(() => {
                me.setState({
                  confirmLoading: false,
                });
              }, 2000)
          },
          false 
        )
      }

    handleOk = () => {
        // if(this.state.maintain_cause === '') return;
        
        let params = {
            applicant_time:this.state.applicant_time,
            approval_time: this.state.approval_time,
            applicant: this.state.applicant,
            applicant_tel:this.state.applicant_tel,
            transfer_unit:this.state.transfer_unit,
            transfer_unit_ads:this.state.transfer_unit_ads,
            transfer_unit_tel:this.state.transfer_unit_tel,
            client_id:this.state.client_id,
            allocation_reason:this.state.allocation_reason,
            transport_unit:this.state.transport_unit,
            agent_tel:this.state.agent_tel,
            agent: this.state.agent,
            opinion: this.state.opinion,
            sign:this.state.sign ,
            remark: this.state.remark,
            equipment_id: this.props.data.key,
            equipment_remark: this.props.data.note,
            host_name: this.props.data.engine_name,
            host_number: this.props.data.engine_code,
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
                title="设备调拨单填写"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                width='600px'
                >
                <div >
                        <table className='scrapTable' border="1" width='550px'  >
                        <thead>
                            <tr>
                                <th colSpan='4'>设备调拨单</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>申请时间:</td>
                                <td colSpan='3'><DatePicker  onChange={this.onChange1} style={{width:300}}/></td>
                            </tr>
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
                                        type='text'
                                        className='inputNOborder'
                                    />
                                </td>
                                <td>申请人电话：</td>
                                <td><input name='applicant_tel'  onChange={this.changeValue} type='text' className='inputNOborder'/></td>
                            </tr>
                            <tr>
                                <td rowSpan='2'>调入单位：</td>
                                <td rowSpan='2'>
                                    <input 
                                        className='inputNOborder'
                                        name='transfer_unit'  
                                        onChange={this.changeValue} 
                                    />
                                </td>
                                <td >调入单位地址：</td>
                                <td>
                                    <input 
                                        className='inputNOborder'
                                        name='transfer_unit'  
                                        onChange={this.changeValue} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td >调入单位电话：</td>
                                <td>
                                    <input 
                                        className='inputNOborder'
                                        name='transfer_unit_tel'  
                                        onChange={this.changeValue} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>客户编号：</td>
                                <td colSpan='3'>
                                    <input 
                                        name='client_id'  
                                        onChange={this.changeValue} 
                                        type='text' 
                                        className='inputNOborder'
                                        style={{border:0, height:44, width:'100%'}}
                                    />
                                </td>
                            </tr>
                            <tr >
                                <td rowSpan='2'>调拨原因：</td>
                                <td colSpan='3' rowSpan='2'>
                                    <textarea
                                        className='textareaNOborder'
                                        name='allocation_reason'  
                                        onChange={this.changeValue} 
                                        style={{border:0, height:60}}
                                     />
                                </td>
                            </tr>
                            <tr></tr>
                            <tr>
                                <td >运输单位：</td>
                                <td>
                                    <input 
                                        name='transport_unit'  
                                        onChange={this.changeValue} 
                                        type='text' 
                                        className='inputNOborder'
                                        style={{border:0, height:44, width:'100%'}}
                                    />
                                </td>
                                <td >经办人：</td>
                                <td>
                                    <input 
                                        name='agent'  
                                        onChange={this.changeValue} 
                                        type='text' 
                                        className='inputNOborder'
                                        style={{border:0, height:44, width:'100%'}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td ></td>
                                <td></td>
                                <td >经办人电话：</td>
                                <td>
                                    <input 
                                        name='agent_tel'  
                                        onChange={this.changeValue} 
                                        type='text' 
                                        className='inputNOborder'
                                        style={{border:0, height:44, width:'100%'}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan='2'>主管意见：</td>
                                <td colSpan='3' rowSpan='2'>
                                    <textarea
                                        className='textareaNOborder'
                                        name='opinion'  
                                        onChange={this.changeValue} 
                                        style={{border:0, height:60}}
                                    />
                                </td>
                            </tr>
                            <tr></tr> 
                            <tr>
                                <td colSpan='2' rowSpan='2'></td>
                                <td>主管签字:</td>
                                <td>
                                    <input 
                                        name='sign'  
                                        onChange={this.changeValue}  
                                        className='inputNOborder'
                                        style={{border:0, height:30}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>审批时间:</td>
                                <td><DatePicker onChange={this.onChange2} /></td>
                            </tr>
                            <tr>
                                <td>备注:</td>
                                <td colSpan='3'>
                                    <textarea
                                        className='textareaNOborder'
                                        name='remark'  
                                        onChange={this.changeValue} 
                                        style={{height:44}}
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

export default AllocationModal;