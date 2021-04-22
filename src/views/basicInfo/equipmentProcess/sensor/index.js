import React,{ Component } from 'react'
import { connect } from 'react-redux'
import { message, Button } from 'antd'
import './sensorStyle.less'
import SensorSetting from '../../../fixedAssets/equipmentInfo/modal/SensorSetting'
import ModelModal from '../../sensorInfo/modal/modelModal';
import CodeModal from '../../sensorInfo/modal/codeModal';
import Equipment from '../componemtCommon/equipment'

class Sensors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: [{}],
            number: 1,            //传感器的数量
            sensorCodeAids: [],   //存放新增传感器的aid
            size: 0,              //存放传感器类型的数量
            sensorTypes: [],      //获取传入的类型
            addModelVisible: false,
            addCodeVisible: false,
            whetherTest: false
        }
    }

    componentDidMount() {
        //有多少种传感器就能添加多少个传感器  size: this.props.sensorTypes.size
        this.setState({
            size: this.props.sensorTypes.size
        })
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

      //显示弹窗
    showModal = (name) => {
        switch (name) {
        case 'model':
            this.setState({addModelVisible: true})
            break;
        case 'code':
            this.setState({addCodeVisible: true})
            break;
        default:
            return;
        }
    }

    //关闭弹窗
    closeModal = () => {
        this.setState({
        addModelVisible: false,
        addCodeVisible: false,
        })
    }

    addsensorTypes = () => {
        let addsensorTypes = [];
        const { usingSensorTypes } = this.props;
        if(usingSensorTypes.size !== 0){
          addsensorTypes = usingSensorTypes.map((item,index) => (
              item.get('type_name')
          ))
        }
        return addsensorTypes;
    }

    afterCreateOrEdit = () => {
    }
    

    render() {
        const { sensors, number, whetherTest, addModelVisible, addCodeVisible } = this.state
        const aftersensorTypes = this.handleSensorTypeData();
        const addsensorTypes = this.addsensorTypes();

        return (
            <div>
                <div><Equipment/></div>
            <div className='sensorPositon'>
                <div className='sensorBtn'>
                    {/* <div className='hardtitle'>传感器配置：</div> */}
                    {/* <Button type="primary" className="button" onClick={() => this.showModal('model')}>新增传感器型号</Button>
                    <Button type="primary" className="button" onClick={() => this.showModal('code')}>新增传感器</Button> */}
                </div>
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
                <div style={{clear: 'both'}}></div>
                <ModelModal
                    types = { addsensorTypes }
                    typesAndAid = {this.props.sensorTypes}
                    whetherTest={ whetherTest }
                    visible={ addModelVisible } 
                    cancel={ this.closeModal }
                />
                <CodeModal
                    types = { addsensorTypes }
                    whetherTest={ whetherTest }
                    visible={ addCodeVisible }
                    cancel={ this.closeModal } 
                    // getInfo={ this.getInfo }
                    afterCreateOrEdit={ this.afterCreateOrEdit }
                />
            </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    sensorTypes: state.getIn(['index', 'usingSensorTypes']),
    usingSensorTypes: state.getIn(['index', 'usingSensorTypes']),
})

export default connect(mapStateToProps, null)(Sensors);
