import React, { Component } from 'react';
import './style.less'
import {  Select, Icon, message} from 'antd';
import { Model } from '../../../dataModule/testBone';
import { sensorModelUrl, sensorCodeUrl } from '../../../dataModule/UrlList';

const model = new Model();
const { Option } = Select;

class editSensorSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensorModels: [],      //所有传感器型号
            sensorCodes: [],       //所有传感器编号
        }
    }

    //获取型号
    getSensorModel(params) {
        let me = this;
        model.fetch(
        params,
        sensorModelUrl,
        'get',
        function(response) {
            me.setState({
                sensorModels: response.data
            })
        },
        function() {
            message.warning('加载失败，请重试')
        },
        false
        )
    }

    //获取编号
    getSensorCode(params) {
        let me = this;
        model.fetch(
        params,
        sensorCodeUrl,
        'get',
        function(response) {
            me.setState({
                sensorCodes: response.data
            })
        },
        function() {
            message.warning('加载失败，请重试')
        },
        false
        )
    }

    //处理选择
    handleSelect = (string, name) => {
        switch (name) {
            case 'type':
                this.props.freshCodeAndModel(this.props.index);
                this.setState({sensor_type:string});
                this.getSensorModel({type_name:string});
                this.props.getSensorTypes(string, this.props.index);     
                break;
            case 'model':
                const { sensorModels } = this.state;
                this.setState({sensor_model:string});
                const index = sensorModels.findIndex(item => string === item.sensor_model);
                const modalAid = sensorModels[index].aid;
                this.getSensorCode({sensor_model_id: modalAid})
                break;
            case 'code':
                const { sensorCodes } = this.state;
                this.setState({sensor_code: string});
                const find = sensorCodes.findIndex(item => string === item.sensor_code);
                const codeAid = sensorCodes[find].aid;
                this.props.getSensorAid(codeAid);
                break;
            default:
                return 0;
        }
    }

    render() {
        return(
            <div>
                <div className='eCreateBlock'>
                    <div className='eCreateName'>类型：</div>
                    <Select
                        className='choice'
                        onSelect={(string) => this.handleSelect(string, 'type')} 
                        placeholder='请选择传感器类型'
                        key={ freshType }
                    >
                    {types.size !== 0? types.map((item) => <Option key={item}  value={item}>{item}</Option>) : null}
                    </Select>
                </div>
            
                <div className='eCreateBlock'>
                    <div className='eCreateName'>型号：</div>
                    <Select 
                        className='choice' 
                        onSelect={(string) => this.handleSelect(string,'model')} 
                        placeholder='请选择传感器型号'
                        key={ freshModel[index] }
                    >
                        {
                            sensorModels.size !== 0? 
                            sensorModels.map((item, index) => <Option key={index} value={item.sensor_model}>{item.sensor_model}</Option>) 
                            : null
                        }
                    </Select>
                </div>
            
                <div className='eCreateBlock'>
                    <div className='eCreateName'>编号：</div>
                    <Select 
                        className='choice'
                        showSearch
                        key={ freshCode[index] }
                        placeholder="请选择传感器编号"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onSelect={(string) => this.handleSelect(string, 'code')} 
                    >
                        {
                            sensorCodes.size !== 0 ? 
                            sensorCodes.map((item,index) => <Option key={index} value={item.sensor_code}>{item.sensor_code}</Option>) 
                            : null
                        }
                    </Select>
                </div>
                <div className='eIcon'>
                    <Icon 
                        type="plus-circle" 
                        theme="twoTone"
                        style={{fontSize: 20}}  
                        onClick={ () => addInfo(number + 1) }
                    />
                    <Icon 
                        type="minus-circle" 
                        theme="twoTone" 
                        twoToneColor='#DC143C'
                        style={{width: 40, fontSize: 20}}
                        onClick={ () => delectInfo(number - 1, index) }
                    />
                </div>
            </div>
        )
    }
}

export default editSensorSetting;


