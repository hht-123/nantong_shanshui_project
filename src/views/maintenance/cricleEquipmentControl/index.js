import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tabs, Modal, Button, message, DatePicker, Select, Input } from 'antd';
import blowdown from '../../../statistics/blowdown.png'
import { throttle } from '../../../publicFunction';
import { autoControlUrl } from '../../../dataModule/UrlList'
import { Model } from '../../../dataModule/testBone'
import { getUserId } from '../../../publicFunction'
import AutoOperationTable from './table.js'
import moment from 'moment'

const model = new Model()
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal

class CircleControl extends Component{
    constructor(props) {
        super(props);
        this.state = {
            color: "#b3b3b3",      //#b3b3b3 关闭       #84d3c9 打开
            disabledWater: false,
            disabledMedicine: false,
            currentChoice: "water",    //当前选择的窗口  water  / medicine
            userID:"",
            pumps: this.props.equipmentPumps,
            // pumps: [{pump_name:'加药泵', pump_code: '11'},{pump_name: '排污泵', pump_code: '22'} , {pump_name:'XXX', pump_code: '333'}],
            days: [],
            begin_time: '',
            end_time: '',
            opration_time: '',
            period: '', // 时间间隔
            setTimeType: '0', // 0为定时操控
            circleTimeType: '1', // 1 为周期操控
            currentPumpCode: this.props.currentPumpCode,
            disabled: true, // 控制设置键是否禁用
            dosage: null,
            seconds: null,
            // 操作记录相关
            tableVisible: false,
            tableData: null,
            pumpRole: this.props.pumpRoles
        }
    }

    componentDidMount(){    
        this.addDays()
        // console.log(this.state)
    }

    //拿到所有泵的pump_id
    getAllPumpId(array, key) {
        var namekey = key || "pump_id";
        var res = [];
        if (array) {
            array.forEach(function(t) {
                res.push(t[namekey]);
            });
        }
        return res;
    }

    //关闭窗口
    handleCancel = e => {
        this.props.close();
    };

    // 处理剂量
    handledosage = (e, numb) => {
        this.setState({
            dosage: e.target.value
        })
        const seconds = Number(e.target.value)/ parseInt(numb, 0)
        this.setState({
            seconds:seconds.toFixed(2)
        })
        //  console.log(Number(e.target.value)/ numb)
    }

    setBeginTime = (time, timeString) => {
        // console.log(timeString)
        this.setState({
            begin_time: timeString
        })
    }

    setEndTime = (time, timeString) => {
        // console.log(timeString)
        this.setState({
            end_time: timeString
        })
    }

    selectChange = (value) => {
        // console.log(String(value))
        this.setState({
            period: String(value)
        })
    }

    addDays = () => {
        let days = []
        for(let i = 1; i <= 31; i++) {
            days.push(i)
        }
        this.setState({
            days
        })
    }

    reset = () => {
        this.setState({
            time: null,
            seconds: null,                    
            color: "#b3b3b3",
            begin_time: '',
            end_time: '',
            opration_time: '',
            period: '',
            dosage: null,
            currentPumpCode: this.props.currentPumpCode
        })
    }

    handleOk = throttle(() => {
        const { end_time, period, begin_time, dosage } = this.state
        if (begin_time === '' || dosage === null ) {
          return  message.warning('开始时间或剂量未填写')
        }
        if (end_time === '' && period === '' ) {
            this.confirmSetTime()
        } else if (end_time !== '' && period !== '' ) {
            this.confirmCircleTime()
        } else {
            message.warning('未按照规定格式填写')
        }
    }, 500)

    // 定时开启确认
    confirmSetTime = () => {
        const me = this
        confirm({
            title: '确认开启定时功能？',
            onOk() {
                me.fixedTimePost()
            },
            onCancel() {},
          })
    }

    // 定时操作请求
    fixedTimePost = () => {
        const { currentPumpCode, setTimeType, begin_time, seconds, dosage } = this.state
        const sendTime = seconds
        const me = this
        const params = {
            pump_code: currentPumpCode,
            // pump_code: 1,
            operation_type: setTimeType,
            operation_time: String(sendTime),
            begin_time: begin_time,
            dosage: dosage + 'L',
            create_by: getUserId()
        }
        model.fetch(
            params,
            autoControlUrl,
            'post',
            function(response) {
                console.log(response)
                message.success('定时功能开启成功')
                me.handleCancel()
            },
            function() {
                message.error('定时功能开启失败')
            },
            false
        )
    }

    // 周期开启确认
    confirmCircleTime = () => {
        const me = this
        confirm({
            title: '确认开启周期性功能？',
            onOk() {
                me.circleControlPost()
            },
            onCancel() {},
          })
    }

    // 周期操作请求
    circleControlPost = () => {
        const { currentPumpCode, circleTimeType, begin_time, end_time, period, seconds, dosage } = this.state
        const sendTime = seconds
        const params = {
            pump_code: currentPumpCode,
            // pump_code: 1,
            operation_type: circleTimeType,
            operation_time: String(sendTime),
            begin_time: begin_time,
            end_time: end_time,
            period: period,
            dosage: dosage + 'L',
            create_by: getUserId()
        }
        let me = this
        model.fetch(
            params,
            autoControlUrl,
            'post',
            function(response) {
                console.log(response)
                message.success('周期性功能开启成功')
                me.handleCancel()
            },
            function() {
                message.error('周期性功能开启失败')
            },
            false
        )
    }

    //窗口切换
    swift = (activeKey) => {
        this.reset();
        console.log(activeKey)
        this.setState({
            currentPumpCode: activeKey
        })
    }

    // 泵操作任务表相关
    closeTable = () => {
        this.setState({
            tableVisible: false
        })
    }
    
    getUndoneData = (e) => {
        let me = this
        model.fetch(
            {pump_code: e, status: '0'},
            autoControlUrl,
            'get',
            function(response) {
                const data = response.data.results
                const tableData = []
                if(data !== undefined ) {
                    for(let i=0; i<data.length; i++) {
                      tableData.push({
                        begin_time: me.getTime(data[i].begin_time),
                        end_time: me.getTime(data[i].end_time),
                        dosage: data[i].dosage,
                        period: me.periodChange(data[i].period),
                        operation_type: me.typeSwift(data[i].operation_type),
                        key: data[i].uuid,
                        pump_code: data[i].pump_code
                      })
                    }
                  }
                me.setState({
                    tableVisible: true,
                    tableData: tableData
                })
            },
            function() {
                message.error('获取该泵未完成任务失败，请重试!')
            },
            false
        )
    }

    //删除数据
    deleteInfo = (uuid, code) => {
        let me = this; 
        model.fetch(
            {},
            `${autoControlUrl}${uuid}/`,
            'delete',
            function(response) {
                me.getUndoneData(code)
            },
            function() {
                message.warning('删除失败，请重试')
            },
            false
        )
    }

    // 截取时间
    getTime = (time) => {
        let year = '' 
        let second = ''
        if (time !== null ) {
        year = time.slice(0,10)
        second = time.slice(11,19)
        return  year + ' ' + second
        }
    }

    typeSwift = (status) => {
        if(status === '1') {
            return '周期控制'
        } else if (status === '0') {
            return '定时控制'
        } else {
            return null
        }
    }

    periodChange = (period) => {
        if(period === null) {
            return null
        }else {
            return period + '天'
        }
    }

    // 禁止选择今天日期之前的日期
    disabledDate = (current) => {
        return current && current < moment().endOf('day');
    }

    render() {
        const { disabledWater, pumps, days, dosage, seconds, pumpRole} = this.state
        const { tableVisible, tableData } = this.state
        var newData = this.getAllPumpId(pumpRole, 'pump_id')
        if (pumps.length === 0) return null

        return (
            <div className="control">
                <Modal
                title="设备控制"
                visible={ this.props.visible }
                onCancel={ this.handleCancel }
                afterClose={ this.reset }
                destroyOnClose
                footer={[
                    <Button  key="back" onClick={this.handleCancel}>取消</Button>
                ]}
                >
                    <Tabs  className="operation" onChange={this.swift}>
                        {
                            pumps.map((item, index) => {
                                return  <TabPane tab={item.pump_name} key={item.pump_code} disabled={disabledWater}>
                                            <img src={ blowdown } className="blowdown" alt=""></img>
                                            <div className="blowdownRight">
                                                {/* <div style={{marginTop: "5px"}}>
                                                    <div style={{float: "left"}}>状态:</div>
                                                    <div className="start" style={{background: color}} >&nbsp;&nbsp;{statusDescribe}&nbsp;&nbsp;</div>
                                                </div> */}
                                                <div>流量: {item.fluid_flow}L/s</div>
                                                <div style={{marginTop: '5px'}}>
                                                    开始日期：
                                                    <DatePicker showTime onChange={this.setBeginTime} disabledDate={this.disabledDate} />
                                                </div>
                                                <div style={{marginTop: '5px'}}>
                                                    结束日期：
                                                    <DatePicker showTime onChange={this.setEndTime} placeholder='定时设置时请勿填写' disabledDate={this.disabledDate} />
                                                </div>
                                                <div style={{marginTop: '5px'}}>
                                                    时间间隔：
                                                    <Select allowClear  style={{ width: 170 }} onChange={this.selectChange} placeholder='定时设置时请勿填写' >
                                                    {
                                                        days.map( item => {
                                                            return <Option value={item} key={item}>{item}</Option>
                                                        })
                                                    }
                                                    </Select>
                                                    &nbsp;&nbsp;天
                                                </div>
                                                <div style={{marginTop: '5px'}}>剂量：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Input name='dosage' style={{width: '130px'}} addonAfter="L(升)" onChange={(e) => this.handledosage(e, item.fluid_flow)} value={dosage} />
                                                </div>
                                                <div style={{marginTop: '5px'}}>时长：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Input style={{width: '130px'}} addonAfter="S(秒)" disabled value={seconds} />
                                                </div>
                                                <div style={{marginTop: '10px'}}>
                                                    <Button type="primary" onClick={() => this.getUndoneData(item.pump_code)}>泵的操作查看</Button>
                                                    {
                                                        (() => {
                                                            for(const i of newData){
                                                                if(i === item.pump_id){
                                                                    return  <Button  type="primary" icon="poweroff" style={{marginLeft: '20px'}} onClick={ this.handleOk}>开启</Button>
                                                                }
                                                            }
                                                        })()
                                                    }
                                                </div>
                                            </div>
                                        </TabPane>
                            })
                        }
                    </Tabs>
                </Modal>
                <AutoOperationTable
                    visible = { tableVisible }
                    close = {this.closeTable}
                    data = {tableData}
                    delete = {this.deleteInfo}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      pumpRoles:  state.get('index').get('pumpRoles').toJS()
    }
}

export default connect(mapStateToProps, null)(CircleControl);