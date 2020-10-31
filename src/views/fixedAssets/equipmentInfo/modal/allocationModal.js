import React,{ Component } from 'react';
import { Modal, message, Select } from 'antd';
import { Model } from "../../../../dataModule/testBone";
import '../style.less'
import { allcationEquipmentUrl, clientUrl} from '../../../../dataModule/UrlList'

const model = new Model();
const { Option } = Select;

class AllocationModal extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            applicant: '',              //申请人
            applicant_tel: '',          //申请电话
            transfer_unit: '',          //调入单位
            transfer_unit_ads: '',      //调入单位地址
            transfer_unit_tel: '',      //调入单位电话
            client_id: '',              //客户编号
            allocation_reason: '',      //调拨原因
            remark: '',
            clientData:[],              //获取所有客户信息

        }
    }

    componentDidMount() {
        this.getClientData({client: 'all'});
    }

    //获取客户信息
    getClientData(params) {
        let me = this;
        model.fetch(
        params,
        clientUrl,
        'get',
        function(response) {
            me.setState({
                clientData: response.data.results
            })
        },
        function() {
            message.warning('加载失败，请重试')
        },
        false
        )
    }

    allocateEquipment(params) {
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
          false 
        )
      }

    handleOk = () => {
        const { client_id } =this.state;
        if(client_id === ''){
            message.warning("请选择客户编号")
            return;
        }
        
        let params = {
            engine_id: this.props.data.engine_id,
            equipment_id: this.props.data.key,
            applicant: this.state.applicant,
            applicant_tel:this.state.applicant_tel,
            client_id:this.state.client_id,
            transfer_unit:this.state.transfer_unit,
            transfer_unit_ads:this.state.transfer_unit_ads,
            transfer_unit_tel:this.state.transfer_unit_tel,
            allocation_reason:this.state.allocation_reason,
            remark: this.state.remark,
        }

        this.setState({
          confirmLoading: true,
        });
        this.allocateEquipment(params);
        this.props.afterCreateOrEdit();
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

    handleAllClient = () => {
        const { clientData } = this.state;
        const handleClientData = clientData.map((item) => (
            {
                data: item.client_unit + '/' + item.client_code,
                aid: item.aid
            }
        ))
        return handleClientData;
    }

    handleSelect = (string) => {
        this.setState({client_id: string})
        const { clientData } = this.state;
        const index =  clientData.findIndex((item) => item.aid === string);
        const currentDate = clientData[index];
        this.setState({
            transfer_unit_tel: currentDate.unit_phone,
            transfer_unit: currentDate.client_unit,
            transfer_unit_ads: currentDate.client_address,
        })
    }

    afterClose = () => {
        this.setState({
            applicant: '',              //申请人
            applicant_tel: '',          //申请电话
            transfer_unit: '',          //调入单位
            transfer_unit_ads: '',      //调入单位地址
            transfer_unit_tel: '',      //调入单位电话
            client_id: '',              //客户编号
            allocation_reason: '',      //调拨原因
            remark: '',
        })
    }

    render() {
        const { visible } = this.props;
        const { confirmLoading, clientData } = this.state;
        const allClient = this.handleAllClient();
        console.log(this.state.clientData)
        
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
                afterClose={ this.afterClose }
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
                                <td>客户编号：</td>
                                <td colSpan='3'>
                                    <Select 
                                        onSelect={(string) => this.handleSelect(string)}
                                        style={{ width: '200px'}}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            allClient.size !== 0? 
                                            allClient.map((item, index) => <Option key={item.aid} value={item.aid}>{item.data}</Option>) 
                                            : null
                                        }
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan='2'>调入单位：</td>
                                <td rowSpan='2'>
                                    {this.state.transfer_unit}
                                </td>
                                <td >调入单位地址：</td>
                                <td>
                                    {this.state.transfer_unit_ads}
                                </td>
                            </tr>
                            <tr>
                                <td >调入单位电话：</td>
                                <td>
                                 {this.state.transfer_unit_tel}
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