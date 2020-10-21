import React, { Component } from 'react';
import { Model } from '../../../dataModule/testBone';

import CalibrationTable from './calibrationTable';
import CalibrationMarkTable from './calibrationMarkTable';
import AddCalibration from './addCalibration';
import  './style.less';
import { device, equipmentUrl, CalibrationMark } from '../../../dataModule/UrlList';

import { DatePicker,Button, Select, message, PageHeader } from 'antd';

const model = new Model()
const {RangePicker} = DatePicker;
const { Option } = Select;
const dataSize = 'middle';

class SensorCalibration extends Component{
  constructor(props) {
    super (props);
    this.state = {
      equipmentIdData: [],
      search: false,          //是否搜索
      currentPage: 1,
      whetherTest: false,     //是否是测试  true为是 false为否
      showPagination: true,     //是否分页
      isLoading: false,         //是否加载
      data: [],                 //表格数据 
      total: 0,                 //一共有多少条数据
      keyValue: "",             //用于重置
      search_begin_time: [],    //开始时间
      search_maintain_cause: '', //查找的维护原因
      addModalVisible:  false,  //增加弹框是否显示
      editInfo: {},             //获取到编辑行的信息
      equipSensor:[],
    }
  }

  componentDidMount() {
    // console.log(this.props.match.params.equipment_id);
    const equipment_id = this.props.match.params.equipment_id;
    let id = this.getId(equipment_id)
    this.getEquipmentID(id)
    // let params = this.getparams();
    // this.getCurrentPage(params);
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
      CalibrationMark,
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
            data: response.data.data,
          })
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
          //获得设备对应的传感器
          let sensor = me.getSensor(me.state.equipmentIdData.equipment_code);
          me.getSensors(sensor);
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

   //  获得设备对应的传感器
   getSensor( deviceNum=this.state.equipmentIdData.equipment_code ) {
    let params = {};
    params = {
      deviceNum,
    }
    return params;
  } 

  getSensors(params) {
    for (let i in params) {
      if (params[i] === undefined || params[i] === null) {
        params[i] = ''
      }
    }
    let me = this;
    model.fetch(
      params,
      device,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
          me.setState({
            equipSensor: response.data
          }) 
          console.log(me.state.equipSensor)
        } else {
          me.setState({
            equipSensor: response.data.data,
          })
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
    let [ search_maintain_cause, search_begin_time ] =[null, null];
    if(this.state.search === true){
      search_maintain_cause = this.state.search_maintain_cause;
      search_begin_time = this.state.search_begin_time;
    }
    
    const params = this.getparams(currentPage, pageSize, this.props.match.params.equipment_id, search_maintain_cause, search_begin_time, )
    this.getCurrentPage(params);
  }

  getparams(currentPage=1, size=10, equipment_id=this.state.equipmentIdData.equipment_code , maintain_cause=null, search_begin_time=null) {
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
      maintain_cause,
      begin_time,
      end_time,
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
    let [ search_maintain_cause, search_begin_time] =[null, null];
    if(this.state.search === true){
      search_maintain_cause = this.state.search_maintain_cause;
      search_begin_time = this.state.search_begin_time;
    }
    const params = this.getparams(1, size, this.props.match.params.equipment_id ,search_maintain_cause, search_begin_time )
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0
  }

  //设备状态下拉框值改变时触发的函数
  handleChange = (value) => {
    // console.log(value);
    this.setState({
      search_maintain_cause: value,
    })
  }

  //重置按钮
  handleReset = () => {
    let params = this.getparams();
    this.getCurrentPage(params);
    this.setState({
      search_maintain_cause: null,
      keyValue: new Date(),
      search_begin_time: null,
      currentPage: 1,
      search: true,
    })
  }

  //搜索按钮
  searchInfo = () => {
    this.setState({search: true});
    const { search_maintain_cause, search_begin_time } = this.state;
    let params = this.getparams(1, 10, this.props.match.params.equipment_id  ,search_maintain_cause, search_begin_time);
    this.getCurrentPage(params);
  }

  //显示增加弹窗
  showAddModal = (record) => {
    this.setState({
      addModalVisible: true,
    });
    record === undefined ? null : this.setState({editInfo:record})
  };

  //关闭弹窗
  closeModal = (visible) => {
    this.setState({
      addModalVisible: visible,
    })
  }

  render() {
    // const equipment_id = this.props.match.params.equipment_id
    const allowClear = true
    const {data, isLoading, showPagination, size, total, equipSensor, addModalVisible, editInfo, whetherTest} = this.state;
    const SensorTableDate = [];
    if(equipSensor !== undefined ) {
      equipSensor.map((item, index) => {
        SensorTableDate.push({
          key: index,
          type_name: item.type_name,
          theoretical_value: item.theoretical_value,
          sensor_id: item.aid,
        })
        return null;
      })
    }

    return (
      <div className='equipmentMaintenance'>
        <PageHeader className='row'
          onBack={() => window.history.back()}
          title="返回"
        />
        <span className='name'>设备编号：{ this.state.equipmentIdData.equipment_code }</span>
        <div className='wrapper'>
          <span className='pageName'>传感器标定：</span>
          <div className='tableWrapper'>
              <CalibrationTable
                data={ SensorTableDate }
                isLoading={ isLoading }
                showAddModal={ this.showAddModal }
              />
              <AddCalibration 
                visible={ addModalVisible }
                cancel={ this.closeModal }
                sensor_id = { editInfo }
                whetherTest={ whetherTest }
                // getSensor ={ this.getSensor.bind(this) }
                // getSensors = { this.getSensors.bind(this) }
              />
          </div>
          <div className='line'></div>
          <span className='pageName'>传感器标定记录：</span>
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
                <div className="input" >传感器名称:</div>
                <Select  allowClear={ allowClear }  style={{ width: 120, }} onChange={ this.handleChange } >
                        <Option value="0">pH值传感器</Option>
                        <Option value="1">用户报修</Option>
                        <Option value="2">运维报修</Option>
                </Select>
              </div>
            </div>
              <div className='buttonList' >
                <Button className="button" type="primary" onClick={ this.searchInfo } >搜索</Button>
                <Button className="button"  onClick={ this.handleReset }>重置</Button>
              </div>
          </div>
          <div className='MarkTableWrapper'>
              <CalibrationMarkTable
                // data={ tableDate }
                isLoading={ isLoading }
                showPagination={ showPagination }
                size={ size }
                total={ total }
                // changePage={ this.getPage }
                // changeSize={ this.getSize }
                // currentPage={ currentPage }
              />
          </div>
        </div>
      </div>
    )
  }
}

export default SensorCalibration;




