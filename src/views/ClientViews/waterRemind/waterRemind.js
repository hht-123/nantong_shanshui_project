import React, { Component } from 'react';
import { Model } from '../../../dataModule/testBone';

import ClientWaterRemindTable from './ClientWaterRemindTable';
import Tip from './tip';
import  './style.less';
import { equipmentUrl, ClientWaterRemindUrl } from '../../../dataModule/UrlList';

import { DatePicker, Button, Select, message, PageHeader } from 'antd';

const model = new Model()
const {RangePicker} = DatePicker;
const { Option } = Select;
const dataSize = 'middle';


class ClientWaterRemind extends Component{
  constructor(props) {
    super (props);
    this.state = {
      equipmentIdData: [],
      search: false,          //是否搜索
      currentPage: 1,
      whetherTest: true,     //是否是测试  true为是 false为否
      showPagination: true,     //是否分页
      isLoading: false,         //是否加载
      data: [],                 //表格数据 
      total: 0,                 //一共有多少条数据
      keyValue: "",             //用于重置时间
      key1: '',                 //重置sensor下拉框
      key2: '',                 //重置status
      search_begin_time: [],    //开始时间
      search_type_name: '',     //查找的传感器
      search_deal_status: '' ,   //是否已处理的状态
      allData: []
    }
  }

  componentDidMount() {
    const equipment_id = this.props.match.params.equipment_id;
    let id = this.getId(equipment_id)
    this.getEquipmentID(id)
    let params = this.getparams();
    this.getCurrentPage(params);
    // this.getCurrentPage();模拟数据用
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
      // '1:1',模拟数据用
      params,
      // 'http://localhost:3008/api/waterRemind.json',模拟数据用
      ClientWaterRemindUrl,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
          me.setState({
            isLoading: false,
            total: response.data.count,
            data: response.data.data,
            currentPage: params['currentPage'],
          })
          console.log(me.state.data)
        } else {
          me.setState({
            isLoading: false,
            total: response.count,
            data: response.data.data,
            currentPage: params['currentPage'],
          })
          console.log(me.state.data)
        }
      },
      function() {
        message.warning('加载失败，请重试')
      },
      this.state.whetherTest
    )
  }

  //得到设备编号
  getId( equipment_id=null ) {
    let params = {};
    params = {
      equipment_id,
    }
    return params;
  } 
  getEquipmentID(params) {
    for (let i in params) {
      if (params[i] === undefined || params[i] === null) {
        params[i] = ''
      }
    }
    let me = this;
    model.fetch(
      params,
      equipmentUrl,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
          me.setState({
            equipmentIdData: response.data.data[0]
          })
          // console.log(me.state.equipmentIdData)
        } else {
          me.setState({
            equipmentIdData: response.data.data,
          })
          console.log(me.state.equipmentIdData)
        }
      },
      function() {
        console.log('加载失败，请重试')
      },
      this.state.whetherTest
    )
  }


  //翻页获取内容
  getPage = (currentPage, pageSize) => {
    let [ search_type_name, search_begin_time, search_deal_status ] =[null, null,null];
    if(this.state.search === true){
      search_type_name = this.state.search_type_name;
      search_begin_time = this.state.search_begin_time;
      search_deal_status = this.state.search_deal_status;
    }
    
    const params = this.getparams(currentPage, pageSize, this.props.match.params.equipment_id, search_type_name, search_begin_time, search_deal_status)
    this.getCurrentPage(params);
  }

  getparams(currentPage=1, size=10, equipment_id=this.props.match.params.equipment_id , type_name=null, search_begin_time=null, deal_status=null) {
    let params = {};
    let begin_time = null;
    let end_time = null;
    if(search_begin_time !== null) {
      [begin_time, end_time] = this.handleDate(search_begin_time);
    }
    params = {
      currentPage,
      size,
      equipment_id,
      type_name,
      begin_time,
      end_time,
      deal_status,
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
    // console.log( this.state.search_begin_time )
  }

  //改变pageSIze获取内容
  getSize = (current, size) => {
    let [ search_type_name, search_begin_time, search_deal_status] =[null, null,null];
    if(this.state.search === true){
      search_type_name = this.state.search_type_name;
      search_begin_time = this.state.search_begin_time;
      search_deal_status = this.state.search_deal_status;
    }
    const params = this.getparams(1, size, this.props.match.params.equipment_id ,search_type_name, search_begin_time, search_deal_status )
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0
  }

  //设备状态下拉框值改变时触发的函数
  handleSensorChange = (value) => {
    // console.log(value);
    this.setState({
      search_type_name: value,
    })
  }

  handleStatusChange = (value) => {
    // console.log(value);
    this.setState({
      search_deal_status: value,
    })
  }

  //重置按钮
  handleReset = () => {
    let params = this.getparams();
    this.getCurrentPage(params);
    this.setState({
      search_type_name: null,
      keyValue: new Date(),
      key1: new Date(),
      key2: new Date(),
      search_begin_time: null,
      search_deal_status: null,
      currentPage: 1,
      search: false,
    })
  }

  //搜索按钮
  searchInfo = () => {
    this.setState({search: true});
    const { search_type_name, search_begin_time, search_deal_status } = this.state;
    let params = this.getparams(1, 10, this.props.match.params.equipment_id  ,search_type_name, search_begin_time, search_deal_status);
    this.getCurrentPage(params);
  }

  statusSWift = (status) => {
    if(status === '1'){
      return '未处理'
    }else if(status === '0'){
      return '已处理'
    }
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
    // const equipment_id = this.props.match.params.equipment_id
    const allowClear = true
    const {data, isLoading, showPagination, size, total, currentPage, key1, key2, whetherTest } = this.state;
    const tableData = [];
    if(data !== undefined ) {
      data.map((item, index) => {
        tableData.push({
          key: item.aid,
          notice_time: this.getTime(item.notice_time),
          deal_time: this.getTime(item.deal_time),
          type_name: item.type_name,
          deal_status: this.statusSWift(item.deal_status) ,
          notice_content: item.notice_content,
        })
        return null;
      })
    }
    if (data.length === 0) return null

    return (
      <div className='waterRemind'>
        <PageHeader className='row'
          onBack={() => window.history.back()}
          title="返回"
        />
        <span className='name'>设备编号：{ this.state.equipmentIdData.equipment_code }</span>
        <div className='wrapper'>
          <span className='pageName'>未处理提示：</span>
          <div className='tipWrapper'>
              { data.map((item, index) => {
                if( item.deal_status === "1") {
                  return <Tip key={index} 
                              time={this.getTime(item.notice_time)} 
                              tipData = {item}
                              whetherTest={ whetherTest }
                              getparams = { this.getparams.bind(this)}
                              getCurrentPage = { this.getCurrentPage.bind(this)}
                        />
                }
              }) }
          </div>
          <div className='line'></div>
          <span className='pageName'> 提示记录：</span>
          <div className='func'>
            <div>
              <div style={{ float: 'left', marginLeft: '20px' }} >
                <div className="input" >提示时间:</div>
                  <RangePicker 
                    key={ this.state.keyValue }
                    size={ dataSize }
                    onChange={ this.handleBeginTime } 
                  />
              </div>
              <div className="inputWrapper" >
                <div className="input" >传感器名称:</div>
                <Select  allowClear={ allowClear } key={key1} style={{ width: 120, }} onChange={ this.handleSensorChange } >
                  <Option value="pH值传感器">pH值传感器</Option>
                  <Option value="电导率传感器">电导率传感器</Option>
                  <Option value="浊度传感器">浊度传感器</Option>
                  <Option value="COD传感器">COD传感器</Option>
                  <Option value="ORP传感器">ORP传感器</Option>
                  <Option value="温度传感器">温度传感器</Option>
                </Select>
              </div>
              <div className="inputWrapper" >
                <div className="input" >是否已处理:</div>
                <Select  allowClear={ allowClear }  key={key2} style={{ width: 120, }} onChange={ this.handleStatusChange } >
                        <Option value="0">已处理</Option>
                        <Option value="1">未处理</Option>
                </Select>
              </div>
            </div>
              <div className='buttonList' >
                <Button className="button" type="primary" onClick={ this.searchInfo } >搜索</Button>
                <Button className="button"  onClick={ this.handleReset }>重置</Button>
              </div>
          </div>
          <div className='tableWrapper'>
              <ClientWaterRemindTable
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

export default ClientWaterRemind;