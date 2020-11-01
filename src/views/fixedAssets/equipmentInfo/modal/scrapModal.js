import React,{ Component } from 'react';
import { Modal, Form,  message } from 'antd';
import { Model } from "../../../../dataModule/testBone";
import '../style.less'
import { ScrapEquipmentUrl, sensorOfequipmentUrl } from '../../../../dataModule/UrlList'
const model = new Model();

class ScrapModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            applicant: '',
            applicant_tel: '',
            scrapping_reasons: '',
            remark: '',
            sensorAids: '',
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.data !== prevProps.data){
            this.getSensorInfo({equipment_id: this.props.data.key});
        }
    }

    //获取当前设备传感器
    getSensorInfo = (params) => {
        let me = this;
        model.fetch(
        params,
        sensorOfequipmentUrl,
        'get',
        function(response) {
            let sensorAids = '';
            if(response.data.data.length !== 0 ){
                sensorAids = response.data.data.map(item => item.aid);
                sensorAids = sensorAids.join(',');
            }else{
                sensorAids = 'false';
            }

            me.setState({
                sensorAids
            })
        },
        function() {
            message.warning('加载失败，请重试')
        },
        this.state.whetherTest
        )
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
            me.props.afterCreateOrEdit();
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
a
    handleOk = () => {
        const {validateFields} = this.props.form;
        validateFields();
        // if(this.state.maintain_cause === '') return;
        let params = {
            engine_id: this.props.data.engine_id,
            equipment_id: this.props.data.key,
            applicant: this.state.applicant,
            applicant_tel:this.state.applicant_tel,
            remark: this.state.remark,
            scrapping_reasons:this.state.scrapping_reasons,
            equipment_sensor: this.state.sensorAids,
        }
        this.setState({
          confirmLoading: true,
        });
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

    afterClose = () => {
        this.setState({
            applicant: '',
            applicant_tel: '',
            scrapping_reasons: '',
            remark: '',
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
                afterClose={ this.afterClose }
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
                            {/* <span style={{color: 'red'}}>* </span> */}
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