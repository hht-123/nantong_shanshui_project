import React, { Component } from 'react';
import { Model } from '../../dataModule/testBone';
import { connect } from 'react-redux'
import store from '../../store'
import { actionCreators as index } from '../../components/index/store'

import  './style/monitor.less';
import Line from './publicComponents/sensorLine';
import CompanyInfo from './publicComponents/companyInfo';
import EquipInfo from './publicComponents/equipInfo';
import DownEquipData from './publicComponents/downEquipData'
import { equipmentUrl, 
  sensorDataUrl, 
  clientUrl, 
  equipmentInfoUrl, 
  equipMaintainUrl, 
  sensorOfequipmentUrl,
  websocketUrl,
  getRealTimeDataUrl,
  ClientWaterRemindUrl
 } from '../../dataModule/UrlList';

import { Icon, Tabs, DatePicker, Button, PageHeader, message } from 'antd';
import { Link } from 'react-router-dom';
import Control  from './equipmentControl/comtrolmodal';
import CircleControl from './cricleEquipmentControl/index'
import moment from 'moment';

const model = new Model()
const { TabPane } = Tabs;
const {RangePicker} = DatePicker;


class Monitor extends Component{
  constructor(props) {
    super (props);
    this.state = {
      equipmentData: [],
      equipmentCode: '',
      sensorData:[],
      whetherTest: false, 
      whetherTest1: false,
      search_begin_time: [],    //开始时间
      equipSensor:[],
      CompanyModalVisible: false,  //客户信息是否显示
      equipModalVisible:false,    //设备详情是否显示
      keyValue: "",             //用于时间重置
      companyInfo: [],
      equipmentInfo:[],
      equipmentDot: false,     // 设备维护的红点提示
      waterRemindDot: false,   // 水质提醒记录红点提示
      equipMaintenanceData:[],   //存设备维护的数据
      sensorModel:[],            //存储设备对应的传感器类型及型号
      controlVisisible: false,   //控制界面的打开
      circleControlVisible: false,     //循环控制界面的打开
      aim_id: "",
      equipmentSortData: null,
      downEquipDataVisible: false,
      currentSensor: null,
      realTimeData: []
    }
  }

  componentDidMount() {
    // console.log(this.props.match.params.equipment_aid);
    const equipment_aid = this.props.match.params.equipment_aid;
    // 获得设备编号和客户公司
    let params = this.getparams(equipment_aid);
    this.getEquipmentData(params);
    this.getEquipmentInfo()
    this.getSensorModel()
    this.getEquipmentMaintenace()
    this.getWaterRemind()
  }
  
  componentWillUnmount() {
    clearInterval(this.intervalId)
    clearInterval(this.intervalRealTime)
    this.setState = (state,callback)=>{
      return;
    };
  }

  getparams( equipment_id=null ) {
    let params = {};
    params = {
      equipment_id,
    }
    return params;
  } 

  //获得设备信息
  getEquipmentData(params) {
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
          const equipment_code = response.data.data[0].equipment_code
          me.setState({
            equipmentData: response.data.data[0],
            equipmentCode: response.data.data[0].equipment_code
          })
          me.getAimId();
          //获得设备对应的传感器类型
          store.dispatch(index.getEquipmentSensor(equipment_code))
          //获得设备对应的泵信息
          store.dispatch(index.getEquipmentPumpsInfo(equipment_code))
          //获得用户对应泵的权限
          store.dispatch(index.getPumpRoles())
          //获得传感器的数据
          // const { search_begin_time } = this.state;
          let params1 = me.getSensorParams(equipment_code);
          me.getSensorData(params1);
          //设置定时器
          me.intervalId = setInterval(() => {
            let params2 = me.getSensorParams(equipment_code);
            me.getSensorData(params2);
          }, 300000)
          me.intervalRealTime = setInterval(() => {
            me.getRealTimeData(equipment_code)
            me.getWaterRemind()
          }, 5000);
          // 获得实时监控数据
          me.getRealTimeData(equipment_code)
        }
      },
      function() {
        // console.log('加载失败，请重试')
        message.error('加载失败，请重试!')
      },
      this.state.whetherTest
    )
  }

  //获取设备id
  getAimId(code) {
    let me = this;
    model.fetch(
      {
        "object_code": this.state.equipmentData.equipment_code,
        "distinguish_code":"0"
      },
      websocketUrl,
      'get',
      function(response) {
          me.setState({
            aim_id: response.data.websocket_id,
          })
          // console.log(response.data.websocket_id)
      },
      function() {
        // console.log('加载失败，请重试')
        message.error('加载失败，请重试!')
      },
      this.state.whetherTest
    )
  }

  getSensorParams( deviceNum='', search_begin_time=null) {
    let params = {};
    let begin_time = null;
    let end_time = null;
    if(search_begin_time !== null) {
      [begin_time, end_time] = this.handleDate(search_begin_time);
    } else {
      // console.log(moment().format('YYYY-MM-DD'))
      begin_time = moment().format('YYYY-MM-DD')
      end_time = moment().format('YYYY-MM-DD')
    }
    params = {
      deviceNum,
      begin_time,
      end_time,
    }
    return params;
  }

  getSensorData(params) {
    for (let i in params) {
      if (params[i] === undefined || params[i] === null) {
        params[i] = ''
      }
    }
    let me = this;
    model.fetch(
      params,
      sensorDataUrl,
      'get',
      function(response) {
        if (me.state.whetherTest1 === false) {
          me.setState({
            sensorData: response.data
          })
          const data = me.props.equipmentSensor
          // const sensorData = me.state.sensorData
          const equipmentSortData = {}
          // const time = []
          for (let i = 0; i< data.length; i++ ) {
            equipmentSortData[data[i]['type_name']] = []
          }
          // console.log(equipmentSortData)
          // for (let y = 0; y< sensorData.length; y++) {
          //   if (y.type_name === )
          // }
        }
      },
      function() {
        message.error('获取数据失败，请刷新再试！')
      },
      this.state.whetherTest1
    )
  }

  getRealTimeData = (code) => {
    let me = this
    model.fetch(
      {equipment_code: code},
      getRealTimeDataUrl,
      'get',
      function(response) {
        let realTimeData = response.data.sort((a, b) => { return a.mearsure_type.localeCompare(b.mearsure_type) })
        me.setState({
          realTimeData: realTimeData
        })
      },
      function() {
        message.error('获取实时监控数据失败，请刷新页面！')
      },
      false
    )
  }

  handleStatusColor = (numb) => {
    if ( numb === '0' ) {
      return  { background:'#00EE76'}
    }else if (numb === '3') {
      return  { background:'red'}
    }else if (numb === '4') {
      return  { background:'blue'}
    }
  }

  handleStatus = (numb) => {
    if ( numb === '0' ) {
      return  '在线'
    }else if (numb === '3') {
      return  '报修'
    }else if (numb === '4') {
      return  '维护'
    }
  }

  //搜索的开始时间
  handleBeginTime = (value, dateString) => {
    this.setState({
      search_begin_time: dateString
    })
    // console.log(dateString)
  }

  handleDate(preDate) {
    if(preDate !== undefined){
      let gte = preDate[0];
      let lte = preDate[1];
      return [gte,lte]
    }
  }

  //搜索按钮
  searchInfo = () => {
    // this.setState({search: true});
    const { search_begin_time, equipmentCode } = this.state;
    let params = this.getSensorParams(equipmentCode, search_begin_time);
    this.getSensorData(params);

  }

  //重置按钮
  reset = () => {
    let params = this.getSensorParams(this.state.equipment_code);
    this.getSensorData(params);
    this.setState({
      search_begin_time: null,
      keyValue: new Date(),
    })
  }

  //显示客户信息弹窗
  showCompanyModal = () => {
    this.setState({
      CompanyModalVisible: true,
    });
       let me = this;
        model.fetch(
          {},
          `${clientUrl}${this.state.equipmentData.client_id}/`,
          'get',
          function(response) {
            if (me.state.whetherTest === false) {
              me.setState({
                companyInfo: response.data
              }) 
              // console.log(me.state.companyInfo)
            } else {
              me.setState({
                companyInfo: response.data.data,
              })
            }
          },
          function() {
            message.warning('请重试')
          },
          this.state.whetherTest 
        )
  };

  //显示设备详情弹窗
  // showEquipmentModal = () => {
  //   this.setState({
  //     equipModalVisible: true,
  //   })
  // };

  downInfoShow = (sensorName) => {
    this.setState({
      downEquipDataVisible: true,
      currentSensor: sensorName
    })
    // console.log(sensorName)
  }

  //获得设备详情（除了对应的传感器类型及型号）
  getEquipmentInfo() {
    let me = this;
        model.fetch(
          {'equipment_id': this.props.match.params.equipment_aid},
          equipmentInfoUrl,
          'get',
          function(response) {
            if (me.state.whetherTest === false) {
              me.setState({
                equipmentInfo: response.data
              }) 
            }
          },
          function() {
            message.warning('请重试')
          },
          this.state.whetherTest 
        )
  }

  //获得设备配置的传感器类型及型号
  getSensorModel() {
    let me = this;
    model.fetch(
      {'equipment_id': this.props.match.params.equipment_aid},
      sensorOfequipmentUrl,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
          me.setState({
            sensorModel: response.data.data
          })
          // console.log(me.state.sensorModel)
        } 
      },
      function() {
        // console.log('加载失败，请重试')
        message.error('获取数据失败，请刷新再试！')
      },
      this.state.whetherTest
    )
  }

  showModal = (type) => {
    switch(type) {
      case 'equipmentDetail':
        return this.setState({
                equipModalVisible: true,
              })
      case 'control':
        this.getAimId()
        return this.setState({
                controlVisisible: true,
              })
      case 'circleControl':
        return this.setState({
                circleControlVisible: true,
              })
      default:
        return null
    }
  }

  //关闭弹窗
  closeModal = (visible) => {
    this.setState({
      CompanyModalVisible: visible,
      equipModalVisible: visible,
      controlVisisible: false,
      downEquipDataVisible: false,
      circleControlVisible: false
    })
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

  getEquipmentMaintenace () {
    let me = this;
    model.fetch(
      {'equipment_id': me.props.match.params.equipment_aid},
      equipMaintainUrl,
      'get',
      function(response) {
        let i = 0
        if (me.state.whetherTest === false) {
          if (response.data.data === undefined || response.data.data === []) return  null
          for (let j = 0; j < response.data.data.length; j++) {
            if(response.data.data[j].maintain_status === '0') {
              i = i +1
            }
          }
          if ( i> 0) {
            me.setState({
              equipmentDot:true
            })
          }else {
            me.setState({
              equipmentDot:false
            })
          }
        }
      },
      function() {
        message.warning('加载失败，请重试')
      },
      this.state.whetherTest
    )
  }

  getWaterRemind() {
    let me = this;
    model.fetch(
      {'equipment_id': me.props.match.params.equipment_aid},
      ClientWaterRemindUrl,
      'get',
      function(response) {
        let i = 0
          // console.log(response.data.data)
          if (response.data.data === undefined || response.data.data === []) return  null
          for (let k = 0; k < response.data.data.length; k++) {
            if( response.data.data[k].deal_status === '1') {
              i = i +1
            }
          }
          if ( i> 0) {
            me.setState({
              waterRemindDot:true
            })
          }else {
            me.setState({
              waterRemindDot:false
            })
          }
      },
      function() {
        message.warning('加载失败，请重试')
      },
      this.state.whetherTest
    )
  }


  // 设备维护页面红点显示
  showEquipmentDot = () => {
    if( this.state.equipmentDot === true) {
      return {display:''}
    }else {
      return {display:'none'}
    }
  }

  // 水质提醒记录红点显示
  showWaterRemindDot = () => {
    if( this.state.waterRemindDot === true) {
      return {display:''}
    }else {
      return {display:'none'}
    }
  }

  changeTab = () => {
    this.setState({
      search_begin_time:[],
      keyValue: new Date()
    })
    let params1 = this.getSensorParams(this.state.equipment_code);
    this.getSensorData(params1);
  }

  render() {
    const equipment_id = this.props.match.params.equipment_aid;
    const today = moment()
    const {
       whetherTest, CompanyModalVisible, equipModalVisible, equipmentInfo, companyInfo, sensorModel, controlVisisible,
       currentSensor, downEquipDataVisible, circleControlVisible, equipmentCode, realTimeData
    } = this.state
    const { equipmentPumps } = this.props

    const time = [];
    const pH =[];
    const orp = [];
    const conduct = [];
    const temper = [];
    if (this.state.sensorData !== undefined ) {
        this.state.sensorData.map((item, index) => {
          time.push(this.getTime(item.time))
          pH.push(parseFloat(item.ph).toFixed(2))
          orp.push(parseFloat(item.orp).toFixed(2))
          conduct.push(parseFloat(item.conduct).toFixed(2))
          temper.push(parseFloat(item.temper).toFixed(2))
          return null;
      })
    }

    function commitInfo(item)  {
      if (item === 'PH传感器' || item === 'Ph传感器' || item === 'ph传感器' ) {
        return  pH
      } else if (item === "ORP传感器" || item === 'orp传感器' ) {
        return  orp
      } else if (item === "电导率传感器") {
        return  conduct
      } else if (item === "温度传感器" || item === '温度传感器传感器' ) {
        return  temper
      } else {
        return  []
      }
    }

    return (
      <div className='monitor1'>
        <PageHeader className='row'
          onBack={() => window.history.back()}
          title="返回"
        />
        <span className='name'>设备编号：{ this.state.equipmentData.equipment_code }</span>
        <span className='company' onClick={this.showCompanyModal} >用户单位：{ this.state.equipmentData.client_unit }</span>
        <CompanyInfo
          whetherTest={ whetherTest }
          visible={ CompanyModalVisible }
          cancel={ this.closeModal }
          data = { companyInfo }
        />
        <div className='wrappers'>
            <div className='table'>
              <div>
                <span>
                  <Link to={`/app/waterRemind/${ equipment_id}`} className=' water'>
                    <Icon className='icon' type="warning" theme="filled" />
                    <div className='describe' >水质提醒记录</div>
                  </Link>
                  <div className='dot' style={this.showWaterRemindDot()} ></div>
                </span>
                <span className='main'>
                  <Link to={`/app/equipmentMaintenance/${ equipment_id}`} className=' water'>
                    <Icon className='icon' type="tool" theme="filled" />
                    <div className='describe ' >设备维护</div>
                  </Link>
                  <div className='dot' style={this.showEquipmentDot() } ></div>
                </span>
                <span className='main'> 
                  <Link to={`/app/sensorCalibratin/${ equipment_id}`} className=' water'>
                    <Icon className='icon' type="dashboard" theme="filled" />
                    <div className='describe'>传感器标定</div>
                  </Link>
                </span>
                {/* <span className='main'><Icon className='icon' type="video-camera" theme="filled" /><div className='describe' >视频监控</div></span> */}
                <span className='main'>
                  <div className='statusColor' style={ this.handleStatusColor(this.state.equipmentData.status) } >
                    { this.handleStatus(this.state.equipmentData.status) }
                  </div>
                  <div className='status'  >设备状态</div>
                </span>
                <span className='main' onClick={ () => this.showModal('equipmentDetail') }  >
                  <div className=' water'>
                    <Icon className='icon' type="profile" theme="filled"  />
                    <div className='describe '  >设备详情</div>
                  </div>
                </span>
                <span className='main' onClick={ () => this.showModal('control') }>
                  <div className=' water'>
                    <Icon className='icon' type="build" theme="filled"  />
                    <div className='describe'>设备单次控制</div>
                  </div>
                </span>
                <span className='main' onClick={ () => this.showModal('circleControl') }>
                  <div className=' water'>
                    <Icon className='icon' theme="filled" type="clock-circle" />
                    <div className='describe'>设备自动控制</div>
                  </div>
                </span>
                <span className='main'>
                  <Link to={`/app/EquipmentOprationRecord/${ equipment_id}`} className=' water'>
                    <Icon className='icon' type="schedule" theme="filled" />
                    <div className='describe' >设备使用日志</div>
                  </Link>
                </span>
              </div>
            </div>
              <div className='tabborder'>
              <Tabs className='tab' defaultActiveKey="实时数据"  type='line' size='large' onChange={this.changeTab}>
                <TabPane tab='实时数据' key='实时数据'>
                  <div className='currentData'>
                    {
                      realTimeData.length === 0 ? <div>无实时数据</div>
                      :realTimeData.map((item, index) => {
                        return <div key={item.uuid} ><span className='sensorValue'>{item.mearsure_type}: </span><span>{item.measurement}</span></div>
                      })
                    }
                  </div>
                </TabPane>
                  {
                    this.props.equipmentSensor.map((item, index) => {
                    return  <TabPane tab={ item.type_name } key={ index } >
                                <RangePicker className='time' 
                                  key={ this.state.keyValue }
                                  onChange={ this.handleBeginTime } 
                                  defaultValue={[moment(today), moment(today)]}
                                />
                                <Button type="primary" className='search' onClick={ this.searchInfo } >搜索</Button>
                                <Button  className='reset' onClick={ this.reset } >重置</Button>
                                <Button className='downData' key={item.type_name} type="primary" onClick={() => this.downInfoShow(item.type_name)} >历史数据下载</Button>
                                <Line  
                                  Xdata = { time } 
                                  Ydata = { commitInfo(item.type_name)}
                                />
                            </TabPane>
                    })
                  }
              </Tabs>
              </div>
              <EquipInfo
                  whetherTest={ whetherTest }
                  visible={ equipModalVisible }
                  cancel={ this.closeModal }
                  data={ equipmentInfo }
                  sensorModel = { sensorModel }
                />
              <Control 
                  visible={ controlVisisible }
                  close={ this.closeModal }
                  equipment_code={ this.state.equipmentData.equipment_code }
                  aim_id={ this.state.aim_id }
                  // equipmentPumps= {equipmentPumps}
              />
              <CircleControl
                  visible={ circleControlVisible }
                  close={ this.closeModal }
                  // equipmentPumps= {equipmentPumps}
                  currentPumpCode = {equipmentPumps.length === 0 ? '' : equipmentPumps[0].pump_code}
              />
              <DownEquipData
                  visible= {downEquipDataVisible}
                  close = { this.closeModal }
                  currentSensor = { currentSensor }
                  equipmentCode = { equipmentCode}
              />
              {/* <div id='downloadDiv' style={{display:'none'}}></div> */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    equipmentSensor: state.get('index').get('equipmentSensor').toJS(),
    equipmentPumps: state.get('index').get('equipmentPumps').toJS(),
    pumpRoles:  state.get('index').get('pumpRoles').toJS()
  }
}

export default connect(mapStateToProps, null)(Monitor)
