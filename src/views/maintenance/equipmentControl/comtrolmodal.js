import React, { Component } from 'react';
import  './style.less';
import { Tabs, Modal, Button, Statistic, TimePicker, Switch, message } from 'antd';
import moment from 'moment';
import blowdown from '../../../statistics/blowdown.png'
import { throttle } from '../../../publicFunction';
import { websocketConnect } from '../../../dataModule/UrlList'
import { getUserId } from '../../../publicFunction'


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
            userID:""
        }
    }

    componentDidMount(){ 
        const userID = getUserId();
        this.setState({
            userID,
        })
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
            console.log(event.data);
            if(backInfo === "11"){
                const { hour, minitue, seconds } = me.state;
                const deadline = Date.now() + 1000 * (parseInt(seconds, 0) + 60 * parseInt(minitue, 0) + 3600 * parseInt(hour, 0));
                me.setState({
                    flag: true,
                    time: null,
                    deadline,
                    color: "#84d3c9",
                    disabledMedicine: true
                })
            }
            if(backInfo === "12"){
                me.setState({
                    flag: false,
                    color: "#b3b3b3",
                    disabledMedicine: false,
                })
                me.closeWebSocket();
            }
    
            if(backInfo === "21"){
                const { hour, minitue, seconds } = me.state;
                const deadline = Date.now() + 1000 * (parseInt(seconds, 0) + 60 * parseInt(minitue, 0) + 3600 * parseInt(hour, 0));
                me.setState({
                    flag: true,
                    time: null,
                    deadline,
                    color: "#84d3c9",
                    disabledWater: true
                })
            }

            if(backInfo === "22"){
                me.setState({
                    flag: false,
                    color: "#b3b3b3",
                    disabledWater: false,
                })
                me.closeWebSocket();
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
        this.close(choice);
    }

    //关闭窗口
    handleCancel = e => {
        this.closeWebSocket();
        console.log(websocket.readyState)
        if(websocket.readyState === 2 || websocket.readyState == 3){
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

    operation = (checked, choice) => {
        const { time, flag } = this.state;
        if(time === null)
        {
            if(flag === true) {
                this.setState({
                    flag: false,
                    deadline: Date.now()
                });
            }else{
                if(choice === "water"){
                    message.warning("请先设置排污时间");
                }else if(choice === "medicine"){
                    message.warning("请先设置加药时间");
                }
            }
        }else{
            const url = websocketConnect;
            this.createWebSocket(url, choice);
        }     
    }

    open = throttle((choice) => {    
        let json = "";  
        if(choice === "water"){
            json ={
                send_id: this.state.userID,                               //用户id
                equipment_code: this.props.equipment_code,   //设备id      
                action: "11",
                distinguish_code: "1",
                aim_id: this.props.aim_id,
                }
            console.log(JSON.stringify(json));
        }else if(choice === "medicine"){
            json ={
                send_id: this.state.userID,                               //用户id
                equipment_code: this.props.equipment_code,   //设备id      
                action: "21",
                distinguish_code: "1",
                aim_id: this.props.aim_id,
                }
            console.log(JSON.stringify(json));
        }

        if(websocket.readyState === 1 && json !== ""){
            websocket.send(JSON.stringify(json));
        }else if(websocket.readyState === 0){
            message.warning("请确认设备是否打开")
        }
    }, 500);

    //关闭泵
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
        }else if(choice === "medicine"){
            json ={
                send_id: this.state.userID,                              //用户id
                equipment_code: this.props.equipment_code,   //设备id      
                action: "22",
                distinguish_code: "1",
                aim_id: this.props.aim_id,
            }
            console.log(JSON.stringify(json));
        }

        if(websocket.readyState === 1 && json !== ""){
            websocket.send(JSON.stringify(json));
        }
    }, 4000);

    reset = () => {
        this.setState({
            time: null,              
            hour: null,
            minitue: null,
            seconds: null,
            deadline: Date.now(),          
            flag: false,             
            color: "#b3b3b3",
            disabledWater: false,
            disabledMedicine: false      
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
        const {time, deadline, flag, color, disabledMedicine, disabledWater} = this.state;
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
                    <Tabs defaultActiveKey="1" className="operation" onChange={this.swift}>
                        <TabPane tab="排污" key="1" disabled={disabledWater}>
                            <img src={ blowdown } className="blowdown" alt=""></img>
                            <div className="blowdownRight">
                                <Countdown value={deadline} onFinish={ () => this.onFinish("water") } />
                                <div style={{marginTop: "5px"}}>
                                    <div style={{float: "left"}}>状态:</div>
                                    <div className="start" style={{background: color}} >&nbsp;&nbsp;启动&nbsp;&nbsp;</div>
                                </div>
                                <div>排污量: 5m^3/s</div>
                                <div>排污时长：
                                    <TimePicker 
                                        value={time} 
                                        onChange={this.setTime}  
                                        placeholder="设置排污时长"
                                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                                    />
                                </div>
                                <div>操作：
                                    <Switch 
                                    defaultChecked 
                                    checked={flag} 
                                    onChange={(checked) => this.operation(checked, "water")}/>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="加药" key="2" disabled={false} disabled={disabledMedicine}>
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
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

export default Control;