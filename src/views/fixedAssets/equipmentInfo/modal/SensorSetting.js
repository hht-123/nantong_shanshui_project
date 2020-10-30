import React, { Component } from 'react';
import '../style.less'
import { Select, Icon, message } from 'antd';
import { Model } from '../../../../dataModule/testBone';
import { sensorModelUrl, sensorCodeUrl } from '../../../../dataModule/UrlList';

const model = new Model();
const { Option } = Select;

class EditSensorSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensorModels: [],      //所有传感器型号
            sensorCodes: [],       //所有传感器编号
        }
    }
    
    
    componentDidUpdate(prevProps){
        if(this.props.item !== prevProps.item) {
            this.getSensorModel({type_name: this.props.item.type_name})
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
        const { selectChange, getSensorTypes, getSensorAid } = this.props;
        switch (name) {
            case 'type':
                this.getSensorModel({type_name: string});
                selectChange('type', this.props.index, string);
                getSensorTypes(string, this.props.index);    
                this.setState({
                    sensorModels: [],      
                    sensorCodes: [],       
                });
                break;
            case 'model':
                selectChange('model', this.props.index, string);
                break;
            case 'code':
                selectChange('code', this.props.index, string);
                const { sensorCodes } = this.state;
                this.setState({sensor_code: string});
                const find = sensorCodes.findIndex(item => string === item.sensor_code);
                const codeAid = sensorCodes[find].aid;
                getSensorAid(codeAid, this.props.index);
                break;
            default:
                return 0;
        }
    }

    getCode = ()  => {
        if(this.state.sensorModels.length > 0){
            const { sensorModels } = this.state;
            const string = this.props.item.sensor_model;
            const index = sensorModels.findIndex(item => string === item.sensor_model);
            if(sensorModels[index] !== undefined){
                const modalAid = sensorModels[index].aid;
                this.getSensorCode({sensor_model_id: modalAid})
            }
        }
    }
      

    render() {
        const { addInfo, delectInfo, number,  types, index, item } = this.props;
        const { sensorModels, sensorCodes } = this.state;
        return(
            <div style={{display: this.props.display}}>
                <div className='eCreateBlock'>
                    <div className='eCreateName'>类型：</div>
                    <Select
                        className='choice'
                        onSelect={(string) => this.handleSelect(string, 'type')} 
                        value={ item.type_name }
                    >
                    {types.size !== 0? types.map((item) => <Option key={item}  value={item}>{item}</Option>) : null}
                    </Select>
                </div>
            
                <div className='eCreateBlock'>
                    <div className='eCreateName'>型号：</div>
                    <Select 
                        className='choice' 
                        onSelect={(string) => this.handleSelect(string,'model')} 
                        onFocus={ this.alert }
                        value={ item.sensor_model  }
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
                        value={ item.sensor_code }
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onMouseEnter={ this.getCode }
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

export default EditSensorSetting;


