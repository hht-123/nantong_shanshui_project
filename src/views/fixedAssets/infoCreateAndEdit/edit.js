import React, { Component } from 'react';
import '../../../style/wrapper.less'
import './style.less'
import { Form, Input, message, Button, Select} from 'antd';
import { Model } from "../../../dataModule/testBone";
import { epuipmentInfoUrl, device, allEngineName } from '../../../dataModule/UrlList';
import { connect } from 'react-redux';

const model = new Model();
const { Option } = Select;
class EpuipmentEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            freshType: [''],      //刷新类型框
            freshModel: [''],     //刷新型号框
            freshCode: [''],      //刷新编号框
            equipment_aid: '',    //当前设备aid
            equipment_code: '',   //设备编号
            engine_code:  '',     //主机编号
            engine_name: '',      //主机名称
            storehouse: '',       //设备仓库
            storage_location: '', //设备库位
            equip_person: '',     //配置人
            note:'',              //备注
            allEngineName: [],     //所有主机信息
            number: 1,            //传感器的数量
            sensors: [{}],        //获取当前设备的所有传感器
            sensorCodeAids: [],   //存放新增传感器的aid
            size: 0,              //存放传感器类型的数量
            sensorTypes: [],      //获取传入的类型
        }
    }

    componentDidMount() {
        this.getCurrentEquipmentInfo({equipment_code: this.props.match.params.equipment_code});
        this.getEngineName({engineNmae: 'all'});
        this.getSensorInfo({deviceNum: this.props.match.params.equipment_code})
    }

    
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //获取当前设备的信息
    getCurrentEquipmentInfo = (params) => {
        let me = this;
        model.fetch(
          params,
          epuipmentInfoUrl,
          'get',
          function(response) {
              const equipment = response.data.data[0];
              me.setState({
                equipment_code: equipment.equipment_code,
                engine_code: equipment.engine_code,
                engine_name: equipment.engine_name,
                storehouse: equipment.storehouse,
                storage_location: equipment.storage_location,
                equip_person: equipment.equip_person,
                equipment_aid: equipment.aid,
                note: equipment.note
              })
          },
          function() {
            message.warning('加载失败，请重试')
            return false;
          },
          false
        )
    }

    //获取所有主机名称和编号
    getEngineName = (params) => {
        let me = this;
        model.fetch(
            params,
            allEngineName,
            'get',
            function(response) {
                me.setState({
                    allEngineName: response.data
                })
            },
            function() {
                message.warning('加载失败，请重试')
                return false;
            },
            false
        )
    }

    //获取所有传感器
    getSensorInfo = (params) => {
        let me = this;
            model.fetch(
            params,
            device,
            'get',
            function(response) {
                me.setState({
                    sensors: response.data
                })
            },
            function() {
            message.warning('加载失败，请重试')
            },
            false
        )
      }

    //处理主机默认信息
    handleEngineDefault = () => {
        const { engine_code, engine_name} = this.state;
        const  equipmentData = engine_name + '/' + engine_code;
        return equipmentData;
    }

    //主机编号和姓名处理
    handleAllEngineName = () => {
        const { allEngineName } = this.state;
        const handledata = allEngineName.map((item) => (
            item.engine_name + '/' + item.engine_code
        ))
        return handledata;
    }

    render() {

        const { equipment_code, storehouse , storage_location, equip_person, note} = this.state;
        const equipmentData = this.handleEngineDefault();
        const handleEngineNmaeDate = this.handleAllEngineName();

        const { getFieldDecorator } = this.props.form;
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
                 <div className='name'>设备信息：</div>
                 <div className='createWrapper'>
                     <div className='createTitle'>设备信息编辑：</div>
                     <div className='middlewrapper'>
                         <div className='createleft'>
                            <Form { ...formItemLayout }>
                                <Form.Item
                                    label='设备编号'
                                    colon
                                >
                                    {getFieldDecorator('equipment_code', {
                                        rules: [{ required: true, message: '请输入设备编号' }],
                                        initialValue: equipment_code
                                    })(
                                        <Input  name="equipment_code" onChange={this.handleChange} />
                                    )}
                                
                                </Form.Item>
                                
                                <Form.Item
                                    label='主机'
                                    colon
                                >
                                    {getFieldDecorator('engine_code', {
                                        rules: [{ required: true, message: '请选择主机编号' }],
                                        initialValue: equipmentData
                                    })(
                                        <Select 
                                            onSelect={(string) => this.handleSelect(string)}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                handleEngineNmaeDate.size !== 0? 
                                                handleEngineNmaeDate.map((item, index) => <Option key={index} value={item}>{item}</Option>) 
                                                : null
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                                
                                <Form.Item
                                    label='仓库'
                                    colon
                                >
                                    {getFieldDecorator('storehouse', {
                                        rules: [{ required: true, message: '请输入设备仓库' }],
                                        initialValue: storehouse
                                    })(
                                        <Input  name="storehouse" onChange={this.handleChange} />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    label='库位'
                                    colon
                                >
                                    {getFieldDecorator('storage_location', {
                                        rules: [{ required: true, message: '请输入设备库位' }],
                                        initialValue: storage_location
                                    })(
                                        <Input  name="storage_location" onChange={this.handleChange} />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    label='配置人'
                                    colon
                                >
                                    {getFieldDecorator('equip_person', {
                                        rules: [{ required: true, message: '请输入配置人' }],
                                        initialValue: equip_person
                                    })(
                                        <Input  name="equip_person" onChange={this.handleChange} />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    label='备注'
                                    colon
                                >
                                <Input  name="note" onChange={this.handleChange} defaultValue={note} />
                                </Form.Item>
                            </Form>
                         </div>

                         <div className='createright'>
                            {/* <div className='hardtitle'>传感器配置：</div>
                            {
                                sensors.map((item, index) => (
                                    <SensorSetting
                                        key={ index }
                                        number={ number }
                                        addInfo={ this.addInfo }
                                        delectInfo={ this.delectInfo }
                                        handleSelect={ this.handleSelect }
                                        types={ aftersensorTypes }
                                        index={ index }
                                        getSensorAid = { this.getSensorAid }
                                        getSensorTypes = { this.getSensorTypes }
                                    />
                                ))
                            } */}
                            <Button type='primary' block className="sensorSubmit" onClick={this.submitNewEquipment}>提交</Button>
                         </div>
                         <div style={{clear: 'both'}}></div>
                     </div>
                 </div>
            </div>
        )}
}

const mapStateToProps = (state) => ({
    sensorTypes: state.getIn(['index', 'sensorTypes']),
})

export default connect(mapStateToProps, null)(Form.create()(EpuipmentEdit));