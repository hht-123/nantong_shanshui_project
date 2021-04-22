import React, { Component } from 'react';
import { message } from 'antd'
import Equipment from '../componemtCommon/equipment'
import PumpSetting from '../../../fixedAssets/equipmentInfo/modal/PumpSetting'
import '../style.less'

class Pumps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pumps: [{}],               //增加泵的
            pumpsId: [],               //存放泵的pump_id
            pumpNumber: 1,
            pumpTypeSize: 4          //存放泵的数量
        }
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


    render() {
        const {  pumps, pumpNumber } = this.state;
        return (
            <div>
                <div>
                    <Equipment/>
                </div>
                <div style={{marginLeft:'50px',marginBottom:'30px'}}>
                    {
                        pumps.map((item, index) => (
                            <PumpSetting
                                testStyle='pump_father'
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
        )
    }
}

export default Pumps

