import React ,{ Component } from 'react';
import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react';

class Line extends Component{
    constructor(props){
        super(props)
        this.state = {
            Ydata:[],
        }
    }

    componentDidMount() {
        this.setState({
            Ydata:  this.props.measure_value 
        })
    }
    /**
     * 折线图的配置对象
     */
    getOption = (Ydata) =>{
        return {
            title: {
                text: '当前' + this.props.value_code + ":" + this.props.measure_value[this.props.measure_value.length - 1]
            },
            tooltip: {},
            legend: {
                data:[ this.props.value_code ]
            },
            xAxis: {
                data:  this.props.measure_time
            },
            yAxis: {},
            series: [{
                name: this.props.value_code,
                type: 'line',
                data: Ydata
            }]
        };
    }
    render(){
        const {Ydata} = this.state;
        return(
            <div>
                <Card>
                    <ReactEcharts option={this.getOption(Ydata)} />
                </Card>
            </div>
        )
    }
}
export default Line;

