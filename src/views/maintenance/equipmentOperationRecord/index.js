import React, { Component } from 'react';
import { Model } from '../../../dataModule/testBone';
import { connect } from 'react-redux'
import store from '../../../store'
import { actionCreators as index } from '../../../components/index/store'

import  './style.less';
import OperationRecordTable from './operationRecordTable'
import { equipmentUrl, operationRecordUrl } from '../../../dataModule/UrlList';

import { DatePicker,Button, Select, message, PageHeader } from 'antd';

const model = new Model()
const {RangePicker} = DatePicker;
const { Option } = Select;
const dataSize = 'middle';

class EquipmentOprationRecord extends Component{
  constructor(props) {
    super (props);
    this.state = {
      equipmentIdData: [],
      equipmentCode: null,
      search: false,          //是否搜索
      currentPage: 1,
      showPagination: true,     //是否分页
      isLoading: false,         //是否加载
      data: [],                 //表格数据 
      size: 10,                  //用于重置
      total: 0,                 //一共有多少条数据
      keyValue: "",             //用于时间重置
      keyName: '',              //用于泵重置
      search_begin_time: [],    //开始时间
      search_pump_code: '',     //查找泵编号
    }
  }

  componentDidMount() {
    const equipment_id = this.props.match.params.equipment_id;
    this.getEquipmentID(equipment_id)
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  //数据请求
  getCurrentPage(params) {
    for (let i in params) {
      if (params[i] === undefined || params[i] === null) {
        params[i] = ''
      }
    }
    let me = this;
    this.setState({isLoading: true})
    model.fetch(
      params,
      operationRecordUrl,
      'get',
      function(response) {
          me.setState({
            isLoading: false,
            total: response.data.count,
            data: response.data.data,
            currentPage: params['currentPage'],
            size: params['size'],
          })
          console.log(response.data.data)
      },
      function() {
        message.warning('加载失败，请重试')
      },
      false,
    )
  }

  //得到设备编号
  getEquipmentID(id) {
    let me = this;
    model.fetch(
      {equipment_id: id},
      equipmentUrl,
      'get',
      function(response) {
          me.setState({
            equipmentIdData: response.data.data[0],
            equipmentCode: response.data.data[0].equipment_code
          })
          const equipment_code = response.data.data[0].equipment_code
          const params = me.getparams(1, 10, equipment_code)
          me.getCurrentPage(params)
          store.dispatch(index.getEquipmentPumpsInfo(equipment_code))
      },
      function() {
        console.log('加载失败，请重试')
      },
      false
    )
  }


  //翻页获取内容
  getPage = (currentPage, pageSize) => {
    let [ search_pump_code, search_begin_time ] =[null, null];
    if(this.state.search === true){
      search_pump_code = this.state.search_pump_code;
      search_begin_time = this.state.search_begin_time;
    }
    
    const params = this.getparams(currentPage, pageSize, this.state.equipmentCode, search_pump_code, search_begin_time,)
    this.getCurrentPage(params);
  }

   //改变pageSIze获取内容
   getSize = (current, size) => {
    let [ search_pump_code, search_begin_time] =[null, null];
    if(this.state.search === true){
      search_pump_code = this.state.search_pump_code;
      search_begin_time = this.state.search_begin_time;
    }
    const params = this.getparams(1, size, this.state.equipmentCode, search_pump_code, search_begin_time )
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0
  }

  getparams(currentPage=1, size=10, equipment_code=null, pump_code=null, search_begin_time=null) {
    let params = {};
    let operation_time_gte = null;
    let operation_time_lte = null;
    if(search_begin_time !== null) {
      [operation_time_gte, operation_time_lte] = this.handleDate(search_begin_time);
    }
    params = {
      currentPage,
      size,
      equipment_code,
      pump_code,
      operation_time_gte,
      operation_time_lte,
    }
    return params;
  }

  handleDate(preDate) {
    if(preDate !== undefined){
      let gte = preDate[0];
      let lte = preDate[1];
      return [gte,lte]
    }
  }

  //搜索的开始时间
  handleBeginTime = (value, dateString) => {
    this.setState({
      search_begin_time: dateString
    })
  }

  //设备状态下拉框值改变时触发的函数
  handleChange = (value) => {
    this.setState({
      search_pump_code: value,
    })
  }

  //重置按钮
  handleReset = () => {
    const { equipmentCode } = this.state
    const params = this.getparams(1, 10, equipmentCode)
    this.getCurrentPage(params)
    this.setState({
      search_pump_code: null,
      keyValue: new Date(),
      search_begin_time: null,
      currentPage: 1,
      search: false,
      keyName: new Date(),
    })
  }

  //搜索按钮
  searchInfo = () => {
    this.setState({search: true})
    const { search_pump_code, search_begin_time, equipmentCode } = this.state
    const params = this.getparams(1, 10, equipmentCode, search_pump_code, search_begin_time )
    this.getCurrentPage(params)
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

  render() {
    const allowClear = true
    const {data, isLoading, showPagination, size, total, currentPage, } = this.state;
    const tableData = [];
    if(data !== undefined ) {
      for(let i=0; i<data.length; i++) {
        tableData.push({
          operation_time: this.getTime(data[i].operation_time),
          pump_code: data[i].pump_code,
          open_time: data[i].open_time,
          operate_status: data[i].operate_status,
          pump_name: data[i].pump_name,
          pump_code: data[i].operation_pump_code,
          user_name: data[i].user_name,
          key: i 
        })
      }
    }

    return (
      <div className='equipmentOperation'>
        <PageHeader className='row'
          onBack={() => window.history.back()}
          title="返回"
        />
        <span className='name'>设备编号：{ this.state.equipmentIdData.equipment_code }</span>
        <div className='wrapper'>
          <span className='pageName'>设备使用日志</span>
          <div className='func'>
            <div>
              <div style={{ float: 'left', marginLeft: '20px' }} >
                <div className="input" >日期筛选:</div>
                  <RangePicker 
                    key={ this.state.keyValue }
                    size={ dataSize }
                    onChange={ this.handleBeginTime } 
                  />
              </div>

              <div className="inputWrapper" >
                <div className="input" >泵编号:</div>
                <Select  allowClear={ allowClear } key={this.state.keyName} style={{ width: 120, }} onChange={ this.handleChange } >
                        {
                          this.props.equipmnetPumps.map((item, index) => {
                            return <Option key={item.pump_id} value={item.pump_code}>{item.pump_code}</Option>
                          })
                        }
                </Select>
              </div>
            </div>

              <div className='buttonList' >
                <Button className="button" type="primary" onClick={ this.searchInfo } >搜索</Button>
                <Button className="button"  onClick={ this.handleReset }>重置</Button>
              </div>
          </div>
          <div className='tableWrapper'>
                <OperationRecordTable
                  data={ tableData }
                  isLoading={ isLoading }
                  showPagination={ showPagination }
                  size={ size }
                  total={ total }
                  changePage={ this.getPage }
                  changeSize={ this.getSize }
                  currentPage={ currentPage }
                />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    equipmnetPumps: state.get('index').get('equipmentPumps').toJS()
  }
}

export default connect(mapStateToProps, null)(EquipmentOprationRecord)
