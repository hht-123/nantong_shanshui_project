import React, { Component } from 'react';
import { Form, Input, message, Button} from 'antd';
import SensorSetting from './sensorSetting';
import '../../../style/wrapper.less'
import './style.less'
import { connect } from 'react-redux';


class EpuipmentCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            equipment_code: '',   //设备编号
            engine_code:  '',     //主机编号
            storehouse: '',       //设备仓库
            storage_location: '', //设备库位
            note:'',              //备注
            number: 1,            //传感器的数量
            sensors: [{}],        //增加传感器的
            // sensorTypes: [],      //存放所有的types
            sensorCodeAids: [],   //存放新增传感器的aid
            size: 0,              //存放传感器类型的数量
            sensorTypes: [],      //获取传入的类型
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.sensorTypes.size !== prevProps.sensorTypes.size){
            this.setState({
                size: this.props.sensorTypes.size
            })
        }
    }


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
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
        console.log(newNumber)
        const { sensors } = this.state;
        const delectSensors = sensors;
        if(newNumber <= 0){
            message.warning("请添加传感器")
            return 0;
        }
        delectSensors.splice(index, 1);   
        this.setState({
            number: newNumber,
            sensors: delectSensors,
        });
    }

    //获取当前的传感器编号
    getSensorAid = (string, index) => {
        const sensorCodeAids = []; 
        sensorCodeAids.push(
            {
                equipment_sensor: string,
                index,
            }
        )
        this.setState({
            sensorCodeAids,
        })
    }

    getSensorTypes = (type, index) => {
        console.log(type);
        console.log(index);
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

    render() {
        const { number, sensors } = this.state;
        const { getFieldDecorator } = this.props.form;
        const aftersensorTypes = this.handleSensorTypeData();
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
                                    label='主机编号'
                                    colon
                                >
                                    {getFieldDecorator('engine_code', {
                                        rules: [{ required: true, message: '请输入主机编号' }],
                                    })(
                                        <Input  name="engine_code" onChange={this.handleChange} />
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
                                        key={ index }
                                        number={ number }
                                        addInfo={ this.addInfo }
                                        delectInfo={ this.delectInfo }
                                        handleSelect={ this.handleSelect }
                                        types={ aftersensorTypes }
                                        index={ index }
                                        getSensorAid = { this.getSensorAid }
                                    />
                                ))
                            }
                            <Button type='primary' block className="sensorSubmit">提交</Button>
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