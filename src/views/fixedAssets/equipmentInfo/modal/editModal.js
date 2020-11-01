import React, { Component } from 'react';
import '../../../../style/wrapper.less'
import '../style.less'
import { Form, Input, message, Select, Modal, Spin} from 'antd';
import { Model } from "../../../../dataModule/testBone";
import {  sensorequipmentUrl, allEngineName, editEquipment} from '../../../../dataModule/UrlList';
import { connect } from 'react-redux';
import SensorSetting from './SensorSetting';


const model = new Model();
const { Option } = Select;
class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            equipment_aid: '',    //当前设备aid
            equipment_code: '',   //设备编号
            engine_code:  '',     //主机编号
            engine_name: '',      //主机名称
            storehouse: '',       //设备仓库
            storage_location: '', //设备库位
            equip_person: '',     //配置人
            note:'',              //备注
            allEngineName: [],    //所有主机编号
            number: 1,            //传感器的数量
            sensors: [],        //获取当前设备的所有传感器
            sensorCodeAids: [],   //存放新增传感器的aid
            size: 0,              //存放传感器类型的数量
            sensorTypes: [],      //获取传入的类型
            confirmLoading: false, 
            spinning: true,
            display: 'none',       
        }
    }

    componentDidMount() {
        this.getEngineName({engineNmae: 'all'});
        this.setState({
            size: this.props.sensorTypes.size
        })
        for(let i = 0; i< this.props.sensorTypes.size; i++){
            const sensors = this.state.sensors;
            sensors.push({});
            this.setState({
                sensors,
            })
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.data !== prevProps.data){
            const { data } = this.props;
            this.setState({
                equipment_code: data.equipment_code,
                engine_code: data.engine_code,
                engine_name: data.engine_name,
                storehouse: data.storehouse,
                storage_location: data.storage_location,
                note: data.note,
                equip_person: data.equip_person,
                equipment_aid: data.key,
              })
        }
        //获取当前设备的传感器设备 并存储当前aid
        if(this.props.sensorModalData !== prevProps.sensorModalData){
            const { sensorModalData } = this.props;
            const aids = sensorModalData.map((item) => item.equipment_id);
            const sensorTypes = sensorModalData.map((item) => (item.type_name));        //初始化类型
            const sensorCodeAids = sensorModalData.map((item) => (item.aid))   //初始化aid
            if(sensorModalData.length === 0){
                sensorModalData.push({});
            }

            this.setState({
                number: sensorModalData.length,
                sensors: sensorModalData,
                sensorCodeAids: aids,
                spinning: false,
                display: 'block',
                sensorTypes,
                sensorCodeAids,
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //编辑更改
    editEquipment = (params) => {
        const me = this;
        this.setState({confirmLoading: true}); 
        model.fetch(
          params,
          editEquipment + this.state.equipment_aid + '/',
          'put',
          function() {
              message.success("编辑成功");
              me.setState({confirmLoading: false})
              me.props.closeModal();
          },
          function() {
            message.warning('编辑失败，请重试')
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
            sensorequipmentUrl,
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

    //处理要发送的数据
    hanleData = () => {
        const {equipment_code, engine_code, storehouse, storage_location, note, sensorCodeAids, equip_person } = this.state;
        let equipment_sensor = '';
        if(storehouse === '' || storage_location==='' || equip_person === '') return 0;
        
        if(sensorCodeAids.length > 1){
            equipment_sensor = sensorCodeAids.join(',');
        }else if(sensorCodeAids.length = 1){
            equipment_sensor = sensorCodeAids[0];
        }

        const params = {
            equipment_code,
            engine_code,
            storehouse,
            storage_location,
            note,
            equipment_sensor,
            equip_person,
            status : 1,
        }
        return params;
    }

     //提交数据
     submitNewEquipment = () => {
        const { validateFields } = this.props.form;  //验证
        validateFields();
        const { equipment_code, engine_code, storehouse, storage_location, equip_person, sensorCodeAids, sensorTypes } = this.state;
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

        const params = this.hanleData();
        this.editEquipment(params);
        this.props.afterCreateOrEdit();
    }

    //处理数据获取主机编号
    handleSelect = (string) => {
        let engine_code = string;
        const index = engine_code.indexOf('/');
        engine_code = engine_code.substr(index + 1);
        this.setState({engine_code});
    }

    //增加条数
    addInfo = (newNumber) => {
        const { sensors } = this.state;
        const addSensors = sensors;
        if(newNumber <= this.state.size){
            addSensors.push({});
        }else{
            message.warning("添加传感器超过最大数量限制")
            newNumber = this.state.size
            return 0;
        }
        this.setState({
            number: newNumber,
            sensors: addSensors,
        });
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
                sensors,
                sensorCodeAids
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

    //获取当前的传感器编号
    getSensorAid = (string, index) => {
        const sensorCodeAids = this.state.sensorCodeAids; 
        if(sensorCodeAids[index] === undefined ){
            sensorCodeAids.push(string);
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

    //判断传感器是否重复
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

    //在选择传感器类型的时候，刷新传感器选择的框
    freshCodeAndModel = (index) => {
        const { freshModel, freshCode} = this.state;
        const [ newModel, newCode] = [ freshModel, freshCode ];
        newModel[index] = new Date();
        newCode[index] = new Date();
        this.setState({
            freshModel: newModel,
            freshCode:  newCode
        });
    }

    //select选择后更改
    selectChange = (name, index, string) => {
        let data = this.state.sensors;
        switch(name) {
            case 'type':
                data[index].sensor_model = '';
                data[index].sensor_code = '';
                data[index].type_name = string;
                const sensorCodeAids = this.state.sensorCodeAids
                sensorCodeAids.splice(index, 1)
                this.setState({
                    sensorCodeAids,
                    sensors: data
                })
                break;
            case 'model':
                data[index].sensor_code = '';
                data[index].sensor_model = string;
                this.setState({sensors: data});
                break;
            case 'code':
                data[index].sensor_code = string;
                this.setState({sensors: data});
                break;
            default:
                return 0;
        }
    }

    //处理传感器型号
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

    //处理主机默认信息
    handleEngineDefault = () => {
        const { engine_code, engine_name } = this.state;
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

    handleCancel = () => {
        this.props.closeModal();
    }

    afterClose = () => {
        this.setState({
            number: 1,
            sensors: [{}],
            spinning: true,
            display: 'none',
        });
        for(let i = 0; i< this.props.sensorTypes.size; i++){
            const sensors = this.state.sensors;
            sensors.push({});
            this.setState({
                sensors,
            })
        }
    }

    render() {

        const { equipment_code, storehouse , storage_location, equip_person, note, number, sensors, confirmLoading, spinning, display} = this.state;
        const { visible } = this.props;
        const equipmentData = this.handleEngineDefault();
        const handleEngineNmaeDate = this.handleAllEngineName();
        const aftersensorTypes = this.handleSensorTypeData();

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
            <Modal
            title={ '编辑当前设备' }
            visible={ visible }
            confirmLoading={ confirmLoading }
            destroyOnClose={ true }
            onCancel={ this.handleCancel }
            onOk={ this.submitNewEquipment }
            width={'1300px'}
            // onOk={ }
            afterClose= { this.afterClose }
            >
                 <div className='createWrapper'>
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
                                        <Input disabled name="equipment_code" onChange={this.handleChange} />
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
                                            disabled
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
                                    {getFieldDecorator('note', {
                                        initialValue: note
                                    })(
                                        <Input  name="note" onChange={this.handleChange}  />
                                    )}
                               
                                </Form.Item>
                            </Form>
                         </div>

                         <div className='createright'>
                         <Spin spinning={ spinning }  className='spin'/>
                        {spinning ? null 
                             : <div className='hardtitle'>传感器配置：</div>}
                        {
                             sensors.map((item, index) => (
                                <SensorSetting
                                    display={ display }
                                    selectChange={ this.selectChange }
                                    item={ item }
                                    key={ index }
                                    index={ index }
                                    number={ number }
                                    addInfo={ this.addInfo }
                                    delectInfo={ this.delectInfo }
                                    types={ aftersensorTypes }
                                    getSensorAid = { this.getSensorAid }
                                    getSensorTypes = { this.getSensorTypes }
                                />
                            ))
                        }
                            
                         </div>
                         <div style={{clear: 'both'}}></div>
                     </div>
                 </div>
            </Modal>
        )}
}

const mapStateToProps = (state) => ({
    sensorTypes: state.getIn(['index', 'usingSensorTypes']),
})

export default connect(mapStateToProps, null)(Form.create()(EditModal));