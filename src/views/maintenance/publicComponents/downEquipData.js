import React, { Component } from 'react';
import { Modal, DatePicker, message } from 'antd';
import { originalUrl, downLoadDataUrl } from '../../../dataModule/UrlList'
import axios from 'axios'
import { throttle } from '../../../publicFunction';

const {RangePicker} = DatePicker;
class DownEquipData extends Component {
    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
            search_time: '',
            begin_time: null,
            end_time: null,
            sensor_type: null
        }
    }
    
    //取消按钮事件
    handleCancel = () => {
        this.props.close()
    };

    handleTime = (value, dateString) => {
        this.setState({
          search_time: dateString
        })
        this.divideTime(dateString)
    }

    divideTime(search_begin_time=null) {
        let begin_time = null;
        let end_time = null;
        if(search_begin_time !== null) {
          [begin_time, end_time] = this.handleDate(search_begin_time);
        }
        this.setState({
            begin_time: begin_time,
            end_time: end_time
        })
    }

    handleDate(preDate) {
        if(preDate !== undefined){
          let gte = preDate[0];
          let lte = preDate[1];
          return [gte,lte]
        }
    }

    handleSensorType = (item) => {
        if (item === 'PH传感器' || item === 'Ph传感器' || item === 'ph传感器' ) {
            return  'ph'
          } else if (item === "ORP传感器" || item === 'orp传感器' ) {
            return  'orp'
          } else if (item === "电导率传感器") {
            return  'conduct'
          } else if (item === "温度传感器" || item === '温度传感器传感器' ) {
            return  'temper'
          } else {
            return  null
          }
    }

    submit = throttle(() => {
        // console.log('type:', this.handleSensorType(this.props.currentSensor))
        this.inputElement.click()
    }, 500)

    formSubmitFn = (e) => {
        // console.log(e)
        e.preventDefault();
        const deviceNum = this.props.equipmentCode
        const begin_time = this.state.begin_time
        const end_time = this.state.end_time
        const sensor_type = this.handleSensorType(this.props.currentSensor)
        const currentSensor = this.props.currentSensor
        const connectUrl = '?deviceNum=' + deviceNum + "&begin_time=" + begin_time + "&end_time=" + end_time + "&sensor_type=" + sensor_type
        axios({
            method: 'get',
            url: originalUrl + downLoadDataUrl + connectUrl,
            responseType: 'blob'
        }).then(
        (res) => {
            // console.log(res)
            const reader = new FileReader()
            reader.readAsDataURL(res.data)
            
            reader.onload = function (e) {
                // console.log(e)
                // 转换完成，创建一个a标签用于下载
                const a = document.createElement('a');
                a.style.display = 'none';
                a.download = begin_time + '至' + end_time + ' ' + currentSensor + '数据'  + '.xls';
                a.href = e.target.result;
                document.body.appendChild(a);
                a.click();  // 自动触发点击a标签的click事件
                document.body.removeChild(a);
            }
        }).catch(
           () => {
               if( begin_time === null || end_time === null ) {
                   message.warning('请选择时间')
               } else {
                   message.error('下载文件失败')
               }
            } 
        )
    }

    render() {
        const { visible, } = this.props;
        const { confirmLoading } = this.state;

        return (
        <div>
            <Modal
                title="选择所需要的数据时间"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                okText = '导出数据'
                onOk={ this.submit }
                onCancel={ this.handleCancel }
                >
                <RangePicker 
                    style={{marginTop: '20px'}} 
                    onChange={ this.handleTime } 
                />
                {/* <div id='downloadDiv' style={{display:'none'}}></div> */}
                <form action="" onSubmit={this.formSubmitFn } id="export-from" style={{display:'none'}} >
                    <input type="submit" id="export-input" ref={input => this.inputElement = input} />
                </form>
            </Modal>
        </div>
        )
    }
}
export default DownEquipData;