import React ,{ Component } from 'react';
import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react';

class Line extends Component{
    constructor(props){
        super(props)
        this.state = {
            Ydata: this.props.Ydata,
            Xdata: this.props.Xdata,
        }
    }

    momentValue = (item) => {
        if( item === undefined ) {
            return  '该时段无测量值'
        } else {
            return  '当前测量值' + item 
        } 
    }

    /**
     * 折线图的配置对象
     */
    getOption = (Ydata) =>{
        return {
            title: {
                text: this.momentValue(this.props.Ydata[ this.props.Ydata.length-1 ]) 
            },
            tooltip: {},
            // legend: {
            //     data:[ this.props.value_code ]
            // },
            xAxis: {
                data:  this.props.Xdata,
                
            },
            dataZoom: [
                {
                    type: 'slider', //滑动条
                    show: true,      //开启
                    xAxisIndex: [0],
                }, 
                {
                    type: 'inside',  //内置滑动，随鼠标滚轮展示
                    xAxisIndex: [0],
                }],
            yAxis: {
                type: 'value',
                boundaryGap : [ 0.5, 1 ]
            },
            // dataZoom: [
            //     {
            //         type: 'slider', //滑动条
            //         show: true,      //开启
            //         yAxisIndex: [0],
            //         left: '93%',  //滑动条位置
            //     }, 
            //     {
            //         type: 'inside',  //内置滑动，随鼠标滚轮展示
            //         yAxisIndex: [0],
            //     }],
            series: [{
                type: 'line',
                data: Ydata
            }]
        };
    }
    render(){

        return(
            <div>
                <Card>
                    <ReactEcharts option={this.getOption(this.props.Ydata)} />
                </Card>
            </div>
        )
    }
}
export default Line;

