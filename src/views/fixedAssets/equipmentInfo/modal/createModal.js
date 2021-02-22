import React, { Component } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';

import SensorSetting from './SensorSetting';
import PumpSetting from './PumpSetting'

import '../../../../style/wrapper.less'
import '../style.less'

import { connect } from 'react-redux';
import { Model } from "../../../../dataModule/testBone";
import { allEngineName, addEquipment } from '../../../../dataModule/UrlList';

const model = new Model();
const { Option } = Select;

class CreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            equipment_code: '',   //设备编号
            engine_code:  '',     //主机编号
            storehouse: '',       //设备仓库
            storage_location: '', //设备库位
            equip_person: '',     //配置人
            note:'',              //备注
            number: 1,            //传感器的数量
            sensors: [{}],        //增加传感器的
            sensorCodeAids: [],   //存放新增传感器的aid
            size: 0,              //存放传感器类型的数量
            sensorTypes: [],      //获取传入的类型
            allEngineName: [],    //获取所有的主机编号
            confirmLoading: false,
            pumps: [{}],               //增加泵的
            pumpsId: [],               //存放泵的pump_id
            pumpNumber: 1,
            pumpTypeSize: 10           //存放泵的数量
        }
    }
    componentDidMount() {
        this.getEngineName({engineNmae: 'all'});
        //有多少种传感器就能添加多少个传感器  size: this.props.sensorTypes.size
        this.setState({
            size: this.props.sensorTypes.size
        })
    }

    componentDidUpdate(prevProps) {
        if(this.props.sensorTypes.size !== prevProps.sensorTypes.size){
            this.setState({
                size: this.props.sensorTypes.size
            })
        }
    }

    //处理要发送的数据
    hanleData = () => {
        const {equipment_code, engine_code, storehouse, storage_location, note, sensorCodeAids, equip_person, pumpsId } = this.state;
        let equipment_sensor = '';
        let equipment_pump = ''
        //判断传入的传感器数量, 泵的数量是否大于1
        if(sensorCodeAids.length > 1 || pumpsId.length > 1){
            equipment_sensor = sensorCodeAids.join(',');
            equipment_pump = pumpsId.join(',')
        }else if(sensorCodeAids.length === 1 || pumpsId.length === 1){
            equipment_sensor = sensorCodeAids[0];
            equipment_pump = pumpsId[0]
        }else{
            equipment_sensor = 'false';
            equipment_pump = 'false'
        }
        const params = {
            equipment_code,
            engine_code,
            storehouse,
            storage_location,
            note,
            equipment_sensor,
            equip_person,
            equipment_pump
            // status : -1,
        }
        return params;
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

    //发送新增设备
    addNewEquipment = (params) => {
        const me = this;
        this.setState({confirmLoading: true}); 
        model.fetch(
          params,
          addEquipment,
          'post',
          function() {
              message.success("新建设备成功");
              me.setState({confirmLoading: false});
              me.afterClose();
              me.props.closeModal();
              me.props.afterCreateOrEdit();   
          },
          function() {
            message.warning('新建失败，请重试')
            setTimeout(() => {
                me.setState({
                    confirmLoading: false,
                });
              }, 2000)
            return false;
          },
          false
        )
    }

    //提交数据
    submitNewEquipment = () => {
        const { validateFields } = this.props.form;  //验证
        validateFields();
        const { equipment_code, engine_code, storehouse, storage_location, equip_person, sensorTypes, sensorCodeAids, pumpsId } = this.state;
        if(equipment_code ==='' || engine_code === '' || storehouse === '' || storage_location==='' || equip_person === '') return 0;


        if(sensorCodeAids.length !== sensorTypes.length){
            message.warning("请选择传感器型号或名称");
            return 0;
        }
        
        const repeat = this.isRepeat(sensorTypes);
        if(repeat === true) {
            message.warning("请不要选择重复的传感器类型");
            return 0;
        }

        const pumpRepeat = this.isRepeat(pumpsId)
        if(pumpRepeat === true) {
            message.warning("请不要选择重复的泵");
            return 0;
        }

        const params = this.hanleData();
        // console.log('提交',params)
        this.addNewEquipment(params); 
    }



    //获取表单里的数据
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    //处理数据获取 返回主机编号
    //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置 
    //substr(start,length) 方法可在字符串中抽取从 start 下标开始的指定数目的字符
    handleSelect = (string) => {
        let engine_code = string;
        const index = engine_code.indexOf('/');
        engine_code = engine_code.substr(index+1);
        this.setState({engine_code});
    }

    //增加条数
    addInfo = (newNumber) => {
        const { sensors} = this.state;
        const addSensors  = sensors;
        if(newNumber <= this.state.size){
            addSensors.push({})
        }else{
            message.warning("添加传感器超过最大数量限制")
            newNumber = this.state.size
            return 0;
        }
        this.setState({
            number: newNumber,
            sensors: addSensors,
        });
        console.log('sensors', this.state.sensors)
    }

    //增加泵的个数
    addPump = (newNumber) => {
        const { pumps } = this.state
        const addPumps = pumps
        if(newNumber <= this.state.pumpTypeSize){
            addPumps.push({})
        }else {
            message.warning("添加泵以达到最大数量上限")
            newNumber = this.state.pumpTypeSize
        }
        this.setState({
            pumpNumber: newNumber,
            pumps: addPumps
        })
        // console.log('pumps', this.state.pumps)
    }

    //删除条数
    delectInfo = (newNumber, index) => {
        const { sensors, sensorTypes, sensorCodeAids } = this.state;
        const [ delectSensors, delectsensorType, deleteAids] = [sensors, sensorTypes, sensorCodeAids];

        if(deleteAids[index] !== undefined ){
            deleteAids.splice(index, 1);
        }

        if(delectsensorType[index] !== undefined ){
            delectsensorType.splice(index, 1);
        }

        if(newNumber === 0){
            const { sensors } = this.state;
            sensors[index].sensor_model = '';
            sensors[index].sensor_code = '';
            sensors[index].type_name = '';
             
            this.setState({
                sensors: delectSensors,
                sensorCodeAids: deleteAids,
                sensorTypes: delectsensorType,
            })
            message.warning('如不添加传感器，单击确定提交')
            return 0;
        }
        delectSensors.splice(index, 1); 
        this.setState({
            number: newNumber,
            sensors: delectSensors,
            sensorTypes: delectsensorType,
            sensorCodeAids: deleteAids,
        });
    }

    //删除泵的个数
    deletePump = (newNumber, index) => {
        const { pumps, pumpsId } = this.state
        const [deletePumps, deleteId] = [pumps, pumpsId ]
        if(deleteId[index] !== undefined ){
            deleteId.splice(index, 1);
        }
        
        if(newNumber === 0){
            const { pumps } = this.state
            pumps[index].pump_name = ''
            pumps[index].pump_id = ''
            this.setState({
                pumps: deletePumps,
                pumpsId: deleteId
            })
            message.warning('如不添加泵，单击确定提交')
            return 0;
        }
        deletePumps.splice(index, 1); 
        this.setState({
            pumpNumber: newNumber,
            pumps: deletePumps,
            pumpsId: deleteId
        })
        // console.log('pumps', this.state.pumps)
        // console.log('pumpsId', this.state.pumpsId)
    }

    //拿到泵的id
    getPumpId = (string, index) => {
        const pumpsId = this.state.pumpsId
        if(pumpsId[index] === undefined) {
            pumpsId.push(string)
        }else {
            pumpsId[index] = string
        }
        this.setState({
            pumpsId
        })
        // console.log('pumpsId', this.state.pumpsId)
    }

    //拿到传感器的aid
    getSensorAid = (string, index) => {
        const sensorCodeAids = this.state.sensorCodeAids; 
        if(sensorCodeAids[index] === undefined ){
            sensorCodeAids.push(string)
        }else{
            sensorCodeAids[index] = string;
        }
        this.setState({
            sensorCodeAids,
        })
    }
    

    //获取选择的传感器的型号
    getSensorTypes = (type, index) => {
        const { sensorTypes } = this.state;
        const newTypes = sensorTypes;
        if(newTypes[index] === undefined){
            newTypes.push(type);
        }else{
            newTypes[index] = type;
        }
        this.setState({sensorTypes: newTypes});
    }
    

    //判断传感器是否重复(哈希)
    isRepeat(arr) {
        const hash = {};
        for (let i in arr) {
            if (hash[arr[i]]){
                return true; 
            }
            hash[arr[i]] = true;
        }
        return false;
    }

    //select选择后更改
    selectChange = (name, index, string) => {
        let data = this.state.sensors;
        switch(name) {
            case 'type':
                data[index].sensor_model = '';
                data[index].sensor_code = '';
                data[index].type_name = string;
                this.setState({sensor: data});
                break;
            case 'model':
                data[index].sensor_code = '';
                data[index].sensor_model = string;
                this.setState({sensor: data});
                break;
            case 'code':
                data[index].sensor_code = string;
                this.setState({sensor: data});
                break;
            default:
                return 0;
        }
    }

    //把对应的name和id存到pumps中
    getString = (name, index, string ) => {
        let data = this.state.pumps
        switch(name) {
            case 'name':
                data[index].pump_name = string
                this.setState({
                    pumps: data
                })
                break;
            case 'pumpid':
                data[index].pump_id = string
                this.setState({
                    pumps: data
                })
                break;
            default:
                return 0;
        }
        // console.log('pumps', this.state.pumps)
    }

    //处理传感器数据
    handleSensorTypeData = () => {
        const aftersensorTypes = [];
        const { sensorTypes } = this.props;
        if(sensorTypes.size !== 0){
          sensorTypes.map((item,index) => {
            aftersensorTypes.push(item.get('type_name'))
            return 0;
          })
        }
        return aftersensorTypes;
    }

    addsensor = () => {
        this.setState({
            isAddsensor: true,
            buttonDisplay: 'none',
        })
    }

    //主机编号和姓名处理
    handleAllEngineName = () => {
        const { allEngineName } = this.state;
        const handledata = allEngineName.map((item) => (
            item.engine_name + '/' + item.engine_code
        ))
        return handledata;
    }

    handleCancel = () => {
        this.props.closeModal();
    }

    //重置
    afterClose = () => {
        this.setState({
            sensors: [{}],
            pumps: [{}],
            number: 1,
            equipment_code: '',   //设备编号
            engine_code:  '',     //主机编号
            storehouse: '',       //设备仓库
            storage_location: '', //设备库位
            equip_person: '',     //配置人
            note:'',              //备注
        });
    }


    render() {
        const { number, sensors, confirmLoading, pumps, pumpNumber } = this.state;
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const handleEngineNmaeDate = this.handleAllEngineName();
        const aftersensorTypes = this.handleSensorTypeData();
        const formItemLayout = {
            labelCol: {
              span: 6
            },
            wrapperCol: {
              span: 16,
            },
          };

        return(
            <Modal
                title={ '新增设备' }
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onCancel={ this.handleCancel }
                width={'1300px'}
                onOk={ this.submitNewEquipment }
                afterClose= { this.afterClose }
            >
                <div>
                    <div className='createWrapper'>
                        <div className='middlewrapper'>
                            <div className='createleft'>
                                <div style={{float:'left', width: '450px'}}>
                                <Form { ...formItemLayout }>
                                    <Form.Item
                                        label='设备编号'
                                        colon
                                    >
                                        {getFieldDecorator('equipment_code', {
                                            rules: [{ required: true, message: '请输入设备编号' }],
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
                                        })(
                                            <Input  name="storehouse" onChange={this.handleChange} />
                                        )}
                                    </Form.Item>

                                    </Form>
                                </div>

                                <div style={{float:'right', width: '450px',marginRight:'60px'}}>
                                <Form { ...formItemLayout }>
                                    <Form.Item
                                        label='库位'
                                        colon
                                    >
                                        {getFieldDecorator('storage_location', {
                                            rules: [{ required: true, message: '请输入设备库位' }],
                                        })(
                                            <Input  name="storage_location" onChange={this.handleChange} />
                                        )}
                                    </Form.Item>

                                    <Form.Item
                                        label='配置人'
                                        colon
                                    >
                                        {getFieldDecorator('equip_person', {
                                            rules: [{ required: true, message: '请指定配置人' }],
                                        })(
                                            <Input  name="equip_person" onChange={this.handleChange} />
                                        )}
                                    </Form.Item>

                                    <Form.Item
                                        label='备注'
                                        colon
                                    >
                                    <Input  name="note" onChange={this.handleChange}  />
                                    </Form.Item>
                                </Form>
                                </div>
                            </div>

                            <div className='createright'>
                                <div className='hardtitle'>传感器配置：</div>
                                {   
                                    sensors.map((item, index) => (
                                        <SensorSetting
                                            selectChange={ this.selectChange }
                                            item={ item }
                                            key={ index }
                                            number={ number }
                                            addInfo={ this.addInfo }
                                            delectInfo={ this.delectInfo }
                                            types={ aftersensorTypes }
                                            index={ index }
                                            getSensorAid = { this.getSensorAid }
                                            getSensorTypes = { this.getSensorTypes }
                                        />
                                    )) 
                                }
                            </div>

                            <div className="creatPump">
                                <div className="pumpTitle">控制泵的配置：</div>
                                <div>
                                    {
                                        pumps.map((item, index) => (
                                            <PumpSetting
                                                item={ item }
                                                key={ index }
                                                number={ pumpNumber }
                                                addInfo={ this.addPump }
                                                delectInfo={ this.deletePump }
                                                index={ index }
                                                getString={ this.getString }
                                                getPumpId={ this.getPumpId }
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                            <div style={{clear: 'both'}}></div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    sensorTypes: state.getIn(['index', 'usingSensorTypes']),
})

export default  connect(mapStateToProps, null)(Form.create()(CreateModal));