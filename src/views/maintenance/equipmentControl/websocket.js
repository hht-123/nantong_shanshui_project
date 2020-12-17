import { message } from 'antd';

let websocket, lockReconnect = false;
let backInfo = "";
let createWebSocket = (url, me) => {
    websocket = new WebSocket(url);
    websocket.onopen = function () {
       heartCheck.reset();
       message.success("连接成功");
       
    }
    websocket.onerror = function () {
        reconnect(url);
    };
    websocket.onclose = function (e) {
        console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
    }
    websocket.onmessage = function (event) {
        const backInfo = event.data;
        if(backInfo === "11"){
            const { hour, minitue, seconds } = this.state;
            const deadline = Date.now() + 1000 * (parseInt(seconds, 0) + 60 * parseInt(minitue, 0) + 3600 * parseInt(hour, 0));
            this.setState({
                flag: true,
                time: null,
                deadline,
                color: "#84d3c9",
                disabledMedicine: true
            })
        }
        if(backInfo === "21"){
            this.setState({
                flag: false,
                color: "#b3b3b3",
                disabledWater: false,
            })
        }

        if(backInfo === "21"){
            const { hour, minitue, seconds } = this.state;
            const deadline = Date.now() + 1000 * (parseInt(seconds, 0) + 60 * parseInt(minitue, 0) + 3600 * parseInt(hour, 0));
            this.setState({
                flag: true,
                time: null,
                deadline,
                color: "#84d3c9",
                disabledWater: true
            })
        }

        if(backInfo === "22"){
            const { hour, minitue, seconds } = this.state;
            const deadline = Date.now() + 1000 * (parseInt(seconds, 0) + 60 * parseInt(minitue, 0) + 3600 * parseInt(hour, 0));
            this.setState({
                flag: false,
                color: "#b3b3b3",
                disabledWater: false,
            })
        } 
    }
}

let reconnect = (url) => {
    if (lockReconnect) return;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
    }, 4000);
}

let heartCheck = {
    timeout: 60000, //60秒
    timeoutObj: null,
    reset: function () {
        clearInterval(this.timeoutObj);
        return this;
    },
    start: function () {
        this.timeoutObj = setInterval(function () {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            websocket.send("HeartBeat");
        }, this.timeout)
    }
}
//关闭连接
let closeWebSocket=()=> {
    websocket && websocket.close();
}

export {
    websocket,
    backInfo,
    createWebSocket,
    closeWebSocket,
};
