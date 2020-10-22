import React, { Component } from 'react';
import { Form, Input, message, Button, Modal, Select} from 'antd';
import SensorSetting from './sensorSetting';
import '../../../style/wrapper.less'
import './style.less'
import { connect } from 'react-redux';
import { Model } from "../../../dataModule/testBone";
import history from '../../../components/common/history';
import { allEngineName, addEquipment } from '../../../dataModule/UrlList';

const model = new Model();
const { confirm } = Modal;
const { Option } = Select;

class EpuipmentCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            freshType: [''],      //刷新类型框
            freshModel: [''],     //刷新型号框
            freshCode: [''],      //刷新编号框
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
            loading: false
        }
    }
    componentDidMount() {
        this.setState({
            size: this.props.sensorTypes.size
        })
        this.getEngineName({engineNmae: 'all'});
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
        const {equipment_code, engine_code, storehouse, storage_location, note, sensorCodeAids, equip_person} = this.state;
        const allAid = sensorCodeAids.map((item) => item.equipment_sensor);
        const equipment_sensor = allAid.join(',');
        const params = {
            equipment_code,
            engine_code,
            storehouse,
            storage_location,
            note,
            equipment_sensor,
            equip_person,
            status : -1,
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
        this.setState({loading: true}); 
        model.fetch(
          params,
          addEquipment,
          'post',
          function() {
              message.success("新建设备成功");
              me.setState({loading: false})
          },
          function() {
            message.warning('新建失败，请重试')
            setTimeout(() => {
                me.setState({
                    loading: false,
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
        const { equipment_code, engine_code, storehouse, storage_location, equip_person } = this.state;
        if(equipment_code ==='' || engine_code === '' || storehouse === '' || storage_location==='' || equip_person === '') return 0;
        const { sensorTypes } = this.state;
        const repeat = this.isRepeat(sensorTypes);
        
        if(repeat === true) {
            message.warning("请不要选择重复的传感器类型");
            return 0;
        }
        const params = this.hanleData();
        const comfirme = this.addNewEquipment(params);
        if(comfirme === false) return 0;
        this.continueOrBack();
    }

    //确认是否继续添加或者返回
    continueOrBack = () => {
        const me = this;
        confirm({
            title: '继续增加新设备?',
            content: '单击取消返回上一页',
            onOk() {
                me.setState({
                    number: 1,            
                    sensors: [{}],        
                    sensorCodeAids: [],            
                    sensorTypes: [],  
                    freshType: new Date(),        
                    freshModel: [new Date()],       
                    freshCode: [new Date()],        
                });
            },
            onCancel() {
                history.push("/app/equipment/");
            },
          });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    //处理数据获取
    handleSelect = (string) => {
        let engine_code = string;
        const index = engine_code.indexOf('/');
        engine_code = engine_code.substr(index+1);
        this.setState({engine_code});
    }

    //增加条数
    addInfo = (newNumber) => {
        const { sensors, freshModel, freshCode  } = this.state;
        const [ addSensors, addModel, addCode] = [sensors, freshModel, freshCode];
        if(newNumber <= this.state.size){
            addSensors.push({});
            addModel.push('');
            addCode.push('');
        }else{
            message.warning("添加传感器超过最大数量限制")
            newNumber = this.state.size
            return 0;
        }
        this.setState({
            number: newNumber,
            sensors: addSensors,
            freshModel: addModel,
            freshCode: addCode
        });
    }

    //删除条数
    delectInfo = (newNumber, index) => {
        const { sensors, freshModel, freshCode, sensorTypes  } = this.state;
        const [ delectSensors, delectModel, delectCode, delectsensorType] = [sensors, freshModel, freshCode, sensorTypes];
        if(newNumber <= 0){
            message.warning("请添加传感器")
            return 0;
        }
        if(delectsensorType[index] !== undefined ){
            delectsensorType.splice(index, 1);
        }
        delectSensors.splice(index, 1);   
        delectModel.splice(index, 1);
        delectCode.splice(index, 1)
        this.setState({
            number: newNumber,
            freshModel: delectModel,
            freshCode: delectCode,
            sensors: delectSensors,
            sensorTypes: delectsensorType,
        });
    }

    //获取当前的传感器编号
    getSensorAid = (string) => {
        const sensorCodeAids = this.state.sensorCodeAids; 
        sensorCodeAids.push({equipment_sensor: string,}
        )
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

    //主机编号和姓名处理
    handleAllEngineName = () => {
        const { allEngineName } = this.state;
        const handledata = allEngineName.map((item) => (
            item.engine_name + '/' + item.engine_code
        ))
        return handledata;
    }

    render() {
        const { number, sensors, freshType, freshModel, freshCode } = this.state;
        const { getFieldDecorator } = this.props.form;
        const handleEngineNmaeDate = this.handleAllEngineName();
        const aftersensorTypes = this.handleSensorTypeData();
        const formItemLayout = {
            labelCol: {
              span: 5
            },
            wrapperCol: {
              span: 16,
            },
          };
        console.log(this.state);
        return(
            <div>
                 <div className='name'>设备信息：</div>
                 <div className='createWrapper'>
                     <div className='createTitle'>新增设备：</div>
                     <div className='middlewrapper'>
                         <div className='createleft'>
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

                         <div className='createright'>
                            <div className='hardtitle'>传感器配置：</div>
                            {
                                sensors.map((item, index) => (
                                    <SensorSetting
                                        freshCodeAndModel = { this.freshCodeAndModel }
                                        freshType={ freshType }
                                        freshModel={ freshModel }
                                        freshCode={ freshCode }
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
                            <Button type='primary' block className="sensorSubmit" loading={this.state.loading} onClick={this.submitNewEquipment}>提交</Button>
                         </div>
                         <div style={{clear: 'both'}}></div>
                     </div>
                 </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    sensorTypes: state.getIn(['index', 'sensorTypes']),
})

export default  connect(mapStateToProps, null)(Form.create()(EpuipmentCreate));