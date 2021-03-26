import React, { Component } from 'react';
import { connect } from 'react-redux'
import  './style.less';
import { Tabs, Modal, Button, Statistic, Switch, message, Input } from 'antd';
// import moment from 'moment';
import blowdown from '../../../statistics/blowdown.png'
import { throttle, getUserId } from '../../../publicFunction';
import { websocketConnect } from '../../../dataModule/UrlList'

const { TabPane } = Tabs;
const { Countdown } = Statistic;
let websocket = false;
// const deadline = Date.now() + 1000 * 60;
// const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
class Control extends Component{
    constructor(props) {
        super(props);
        this.state = {
            time: null,              //设置时间
            hour: null,
            minitue: null,
            seconds: null,
            deadline: Date.now(),          //倒计时
            flag: false,             //switch开关
            color: "#b3b3b3",      //#b3b3b3 关闭       #84d3c9 打开
            disabledWater: false,
            disabledMedicine: false,
            currentChoice: "water",    //当前选择的窗口  water  / medicine
            userID:"",
            pumps: this.props.equipmentPumps,
            // pumps: ['加药泵', '排污泵', 'XXX'],
            sendTime: null,
            dosage: null,
            pumpRole: []
        }
    }

    componentDidMount(){ 
        const userID = getUserId();
        this.setState({
            userID,
        })  
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

    createWebSocket = (url, choice) => {
        websocket = new WebSocket(url);
        const me = this;
        websocket.onopen = function () {
           message.success("连接成功");
           me.open(choice);
        }
        websocket.onclose = function (e) {
            console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
        }
        websocket.onmessage = function (event) {
            const backInfo = event.data;
            if( backInfo === "该设备未登录" ) {
                message.warning('该设备未登录')
            } else {
                console.log(event.data);
            }

            if(backInfo === "1"){
                const { seconds } = me.state;
                const deadline = Date.now() + 1000 * (parseInt(seconds, 0));
                me.setState({
                    flag: true,
                    time: null,
                    deadline,
                    color: "#84d3c9",
                    disabledMedicine: true
                })
            }

            if(backInfo === "0"){
                message.error('设备开启失败！')
            }


            if(backInfo === "设备正在被使用"){
                message.warning("设备正在被使用,请稍后再试")
            } 
        }
    }

    closeWebSocket=()=> {
        websocket && websocket.close();
    }
    
    //倒计时停止
    onFinish = (choice)=> {
        // this.close(choice);
        this.setState({
            time: null,              
            seconds: null,
            deadline: Date.now(),          
            flag: false,             
            color: "#b3b3b3",
        })
    }

    //关闭窗口
    handleCancel = e => {
        this.closeWebSocket();
        console.log(websocket)
        if(websocket.readyState === 2 || websocket.readyState === 3){
            this.props.close();
        }else{
            if(this.state.currentChoice === "water"){
                this.close("water");
            }
            else if(this.state.currentChoice === "medicine"){
                this.close("medicine");
            }
        }
        this.props.close();
    };

    //设置时间
    setTime = (time, timeString) => {
        const data = timeString;
        this.setState({ 
            time: time,
            hour: data.split(":")[0],
            minitue: data.split(":")[1],
            seconds: data.split(":")[2],
        });
    };

    // 处理剂量
    handledosage = (e, numb) => {
         this.setState({
             dosage: e.target.value
         })
         const seconds = parseInt(Number(e.target.value)/ parseInt(numb, 0))
         this.setState({
             seconds:seconds
         })
        //  console.log(Number(e.target.value)/ numb)
    }

    operation = (checked, pump) => {
        const { dosage, flag } = this.state;
        if(dosage === null)
        {
            if(flag === true) {
                this.setState({
                    flag: false,
                    deadline: Date.now()
                });
            }else{
                    message.warning('请先设置'+ pump.pump_name + '剂量')
            }
        }else{
            const url = websocketConnect;
            this.createWebSocket(url, pump);
        }     
    }

    open = throttle((choice) => {    
        let json = "";
        const { seconds, dosage } = this.state;
        const sendTime =  String(seconds)
        let actionInfo = {
            pump_code: choice.pump_code,
            // pump_code: 1,
            open_time: sendTime,
            dosage: dosage + 'L'
        }
        json ={
            send_id: this.state.userID,                               //用户id
            equipment_code: this.props.equipment_code,   //设备id      
            action: actionInfo,
            distinguish_code: "1",
            aim_id: this.aimIdChange(),
            }
        console.log(JSON.stringify(json));

        if(websocket.readyState === 1 && json !== ""){
            websocket.send(JSON.stringify(json));
        }else if(websocket.readyState === 0){
            message.warning("请确认设备是否打开")
        }
    }, 500);

    aimIdChange = () => {
        if( this.props.aim_id === undefined ) {
            return " "
        } else {
            return this.props.aim_id
        }
    }

    //关闭泵命令
    close = throttle((choice) => {
        console.log(choice)
        let json = "";
        if(choice === "water"){
            json ={
                send_id: this.state.userID,                           //用户id
                equipment_code: this.props.equipment_code,   //设备id      
                action: "12",
                distinguish_code: "1",
                aim_id: this.props.aim_id,
                }
            console.log(JSON.stringify(json));
        }
    }, 4000);

    reset = () => {
        this.setState({
            time: null,              
            seconds: null,
            deadline: Date.now(),          
            flag: false,             
            color: "#b3b3b3",
            disabledWater: false,
            disabledMedicine: false,
            dosage: null  
        })
    }

    //窗口切换
    swift = (activeKey) => {
        this.reset();
        switch(activeKey){
            case "1":
                this.setState({currentChoice: "water"});
                break;
            case "2":
                this.setState({currentChoice: "medicine"})
                break;
            default:
                return;
        }
    }


    
    //状态：启动
    render() {
        // const { time, disabledMedicine } = this.state
        const { deadline, flag, color, disabledWater, pumps, dosage, seconds } = this.state;
        var newData = this.getAllPumpId(this.props.pumpRoles, 'pump_id')
        const {equipmentPumps } = this.props

        return (
            <div className="control">
                <Modal
                title="设备控制"
                visible={ this.props.visible }
                onOk={ this.handleOk }
                onCancel={ this.handleCancel }
                afterClose={ this.reset }
                footer={
                    <Button onClick={ this.handleCancel }>关闭</Button>
                }
                >
                    <Tabs defaultActiveKey="0" className="operation" onChange={this.swift}>
                        {
                            equipmentPumps.length === 0 ? <TabPane tab='未配置泵' key='未配置泵' ></TabPane>
                            :equipmentPumps.map((item, index) => {
                                return  <TabPane tab={item.pump_name} key={index} disabled={disabledWater}>
                                            <img src={ blowdown } className="blowdown" alt=""></img>
                                            <div className="blowdownRight">
                                                <Countdown 
                                                    value={deadline} 
                                                    onFinish={ () => this.onFinish() } 
                                                />
                                                <div style={{marginTop: "5px"}}>
                                                    <div style={{float: "left"}}>状态:</div>
                                                    <div className="start" style={{background: color}} >&nbsp;&nbsp;启动&nbsp;&nbsp;</div>
                                                </div>
                                                <div>流量：{item.fluid_flow}L/s</div>
                                                <div style={{marginTop: "5px"}}>剂量：
                                                    <Input name='dosage' style={{width: '130px'}} addonAfter="L(升)" onChange={(e) => this.handledosage(e, item.fluid_flow)} value={dosage} />
                                                </div>
                                                <div style={{marginTop: "5px"}}>时长：
                                                    <Input style={{width: '130px'}} addonAfter="S(秒)" disabled value={seconds} />
                                                </div>
                                                <div>       
                                                {
                                                    (() => {
                                                        for(const i of newData){
                                                            if(i === item.pump_id){
                                                                return  <div style={{marginTop: "5px"}}>操作：
                                                                            <Switch
                                                                            defaultChecked
                                                                            checked={flag}
                                                                            onChange={(checked) => this.operation(checked, item)}/>
                                                                        </div>
                                                            }
                                                        }
                                                    })()
                                                }
                                                </div>  
                                            </div>
                                        </TabPane>
                            })
                        }
                        {/* <TabPane tab="加药" key="2" disabled={false} disabled={disabledMedicine}>
                            <img src={blowdown} className="blowdown" alt=""></img>
                            <div className="blowdownRight">
                                <Countdown value={deadline} onFinish={ () => this.onFinish("medicine") } />
                                <div style={{marginTop: "5px"}}>
                                    <div style={{float: "left"}}>状态:</div>
                                    <div className="start" style={{background: color}} >&nbsp;&nbsp;启动&nbsp;&nbsp;</div>
                                </div>
                                <div>加药量: 5m^3/s</div>
                                <div>加药时长：
                                    <TimePicker 
                                        value={time} 
                                        onChange={this.setTime}  
                                        placeholder="设置加药时长"
                                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                                    />
                                </div>
                                <div>操作：
                                    <Switch 
                                    defaultChecked 
                                    checked={flag} 
                                    onChange={(checked) => this.operation(checked, "medicine")}/>
                                </div>
                            </div>
                        </TabPane> */}
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      pumpRoles:  state.get('index').get('pumpRoles').toJS(),
      equipmentPumps: state.get('index').get('equipmentPumps').toJS(),
    }
  }

export default connect(mapStateToProps, null)(Control);