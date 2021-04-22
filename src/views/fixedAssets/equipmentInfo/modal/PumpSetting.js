import React, { Component } from 'react';
import { Select, Icon } from 'antd'

import { Model } from '../../../../dataModule/testBone'
import { unequipmentPimpUrl } from '../../../../dataModule/UrlList'

import '../style.less'

const model = new Model();
const { Option } = Select;

class PumpSetting extends Component{
    constructor(props){
        super(props)
        this.state = {
            pumpsModal: [],  //所有泵的名称
        }
    }

    componentDidMount(){
        this.getPumpData()
    }

    
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
            return;
        };
    }

    //获得泵的名称
    getPumpData(){
        let me = this
        model.fetch(
            {
                status: 0
            },
            unequipmentPimpUrl,
            'get',
            function(response) {
                me.setState({
                    pumpsModal: response.data.data
                })
            },
            function() {
                console.log('加载失败，请重试')
            }
        )
    }

    //泵名称和id对应处理
    handlePumpName = (string) => {
        const { pumpsModal } = this.state;
        // console.log('pumpsModal', pumpsModal)
        const pumpsObject = {}
        for (let i = 0; i < pumpsModal.length; i++) {
            pumpsObject[pumpsModal[i]['pump_name']] = pumpsModal[i]['pump_id']
        }
        // console.log('pumpsObject', pumpsObject)
        // console.log(pumpsObject[string])
        this.props.getString('pumpid', this.props.index, pumpsObject[string])
        this.props.getPumpId(pumpsObject[string], this.props.index)
    }

    //获取输入框内容
    handleSelect = (string) => {
        this.setState({
            pump_name: string
        })
        this.handlePumpName(string)
        this.props.getString('name', this.props.index, string)
    }

    render(){
        const { addInfo, number, delectInfo, index, item, testStyle } = this.props
        let pumpAloneStyle = 'pumpAlone'
        if (testStyle !== undefined) {
            pumpAloneStyle = pumpAloneStyle + ' ' + testStyle
        }
        // console.log('item',item)
        const { pumpsModal } = this.state
        return(
            <div className={pumpAloneStyle}> 
                <div className="pCreateName pump_name">控制泵的名称：</div>
                <div className='pump_aline'>
                    <Select 
                            className='pumpchoice pump_choice' 
                            onSelect={(string) => this.handleSelect(string)} 
                            value={ item.pump_name  }
                        >
                            {
                                pumpsModal.size !== 0? 
                                pumpsModal.map((item, index) => <Option key={item.pump_code} value={item.pump_name}>{item.pump_name}</Option>) 
                                : null
                            }
                    </Select>

                    <div className='pIcon pump_icon'>
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
            </div>
        )
    }
}

export default PumpSetting

