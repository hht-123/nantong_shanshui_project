import React, {Component} from 'react';
import {Button, Input, message, Select } from 'antd';
import '../../../style/wrapper.less'
import './style.less'
import SensorTabel from './sensorTbale';
import TypeModal from './modal/typeModal';
import ModelModal from './modal/modelModal';
import CodeModal from './modal/codeModal';
import EditModal from './modal/editModal';
import { Model } from '../../../dataModule/testBone';
import { sensorInfoUrl, sensorModelUrl } from '../../../dataModule/UrlList';
import { connect } from 'react-redux';
import SenosrEditModal from './modal/senosrEditModal';


const model = new Model();
const { Option } = Select;
class SensorInfo extends Component {
  constructor(props){
      super (props);
      this.state = {
        search: false,            //是否搜索
        key1:'',                   //重置select
        key2: '',
        key3: '',
        whetherTest: false,       //是否是测试  true为是 false为否
        sensorTypes: [],          //储存所有传感器类型
        sensorModels: [],         //储存所有传感器型号
        data: [],                 //储存所有传感器的信息
        // searchSensorType: '',  //搜索传感器类型
        searchSensorModel: '',    //搜索传感器型号
        searchSensorCode: '',     //搜索传感器编号
        showPagination: true,     //是否分页 true为分页
        currentPage:1,            //当前页面
        size: 10,
        total:0,                  //页面的总量
        status: '',                //传感器状态
        isLoading: false,         //表格是否显示加载中
        addTypeVisible: false,    //是否显示增加传感器类型弹窗
        addModelVisible: false,   //是否显示增加传感器型号弹窗
        addCodeVisible: false,    //是否显示增加传感器信息弹窗
        sensorEditVisible: false,  //管理传感器类型和型号
        editvisible: false,       //是否显示编辑弹窗
        editInfo: {},             //获取当前行的信息
        roleData: [],             //获取角色的权限
      } 
  }

  componentDidMount() {
    const params = this.getParams();
    this.getInfo(params);
  }

  getParams(currentPage=1, pageSize=10, status=null, searchSensorType=null, searchSensorModel=null, searchSensorCode=null) {
    const params = {
      currentPage,
      status,
      size: pageSize,
      type_name: searchSensorType,
      sensor_model: searchSensorModel,
      sensor_code: searchSensorCode,
    }
    return params;
  }

  //获取部件的信息，分页，获取所有传感器类型
  getInfo(params) {
    for (let i in params) {
      if (params[i] === undefined || params[i] === null) {
        params[i] = ''
      }
    }
    let me = this;
    this.setState({isLoading: true})
    model.fetch(
      params,
      sensorInfoUrl,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
            me.setState({
              isLoading: false,
              total: response.data.count,
              data: response.data.data,
              currentPage: params['currentPage'],
              size: params['size']
            })
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

  //获取型号
  getSensorModel(params) {
    let me = this;
    model.fetch(
      params,
      sensorModelUrl,
      'get',
      function(response) {
        me.setState({
          sensorModels: response.data
        })
      },
      function() {
        message.warning('加载失败，请重试')
      },
      this.state.whetherTest
    )
  }
  
  //获取对应传感器类型的型号
  handleSensorModel= (string) => {
    this.setState({searchSensorType: string, key2:new Date()});
    const params = {type_name: string};
    this.getSensorModel(params);
  }

  //显示弹窗
  showModal = (name) => {
    switch (name) {
      case 'type':
        this.setState({addTypeVisible: true})
        break;
      case 'model':
        this.setState({addModelVisible: true})
        break;
      case 'code':
        this.setState({addCodeVisible: true})
        break;
      case 'sensor':
        this.setState({sensorEditVisible: true})
      default:
        return;
    }
  }

  //显示编辑窗口
  showEditModal = (record) => {
    this.setState({editvisible: true,});
    if(record === undefined){
      return null;
    }else{
      this.setState({editInfo: record})
    }
    // record === undefined ? null : this.setState({editInfo: record})
  }

  //关闭弹窗
  closeModal = () => {
    this.setState({
      addTypeVisible: false,
      addModelVisible: false,
      addCodeVisible: false,
      editvisible: false,
      sensorEditVisible: false,
    })
  }

  //翻页获取内容
  getPage = (currentPage, size) => {
    let [searchSensorType, searchSensorModel, searchSensorCode] = [null, null, null];
    const { status } = this.state;
    if(this.state.search === true){
      searchSensorType = this.state.searchSensorType;
      searchSensorModel = this.state.searchSensorModel;
      searchSensorCode = this.state.searchSensorCode;
    }
    const params = this.getParams(currentPage, size, status, searchSensorType, searchSensorModel, searchSensorCode)
    this.getInfo(params);
  }

  //改变pageSIze获取内容
  getSize = (current, size) => {
    let [searchSensorType, searchSensorModel, searchSensorCode] = [null, null, null];
    const { status } = this.state;
    if(this.state.search === true){
      searchSensorType = this.state.searchSensorType;
      searchSensorModel = this.state.searchSensorModel;
      searchSensorCode = this.state.searchSensorCode;
    }
    const params = this.getParams(1, size, status, searchSensorType, searchSensorModel, searchSensorCode)
    this.getInfo(params);
    document.scrollingElement.scrollTop = 0
  }

  afterCreateOrEdit = () => {
    let [searchSensorType, searchSensorModel, searchSensorCode] = [null, null, null];
    const { status } = this.state;
    const { size, currentPage } = this.state;
    if(this.state.search === true){
      searchSensorType = this.state.searchSensorType;
      searchSensorModel = this.state.searchSensorModel;
      searchSensorCode = this.state.searchSensorCode;
    }
    const params = this.getParams(currentPage, size, status, searchSensorType, searchSensorModel, searchSensorCode)
    this.getInfo(params);
  }

  //重置按钮
  handleReset = () => {
    let params = this.getParams();
    this.getInfo(params);
    this.setState({
      searchSensorType: null,
      searchSensorModel: null,
      searchSensorCode: null,
      sensorModels: [],
      key1:new Date(),
      key2:new Date(),
      key3:new Date(),
      search: false,
      status: '',
    })
  }

  //搜索按钮
  searchInfo = () => {
    this.setState({search: true});
    const { searchSensorType, searchSensorModel, searchSensorCode, status } = this.state;
    let params = this.getParams(1, 10, status, searchSensorType, searchSensorModel, searchSensorCode);
    this.getInfo(params);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  setStatus = (string) => {
    this.setState({status: string})
  }

  statusSWift(status) {
    if(status === '1'){
      return '正在使用'
    }else if(status === '0'){
      return '报废'
    }else if(status === '2'){
      return '未使用'
    }
  }

  //处理表格数据
  handleData = () => {
    const {data} = this.state;
    if(data !== undefined) {
      const tableDate = data.map((item) => ({
          key: item.aid,
          type_name: item.type_name,
          sensor_model: item.sensor_model,
          sensor_code: parseInt(item.sensor_code, 0),
          sensor_threshold: item.sensor_threshold,
          theoretical_value: item.theoretical_value,
          notice_content: item.notice_content,
          default_compensation: item.default_compensation,
          status: this.statusSWift(item.status),
          note: item.note,
        }))
      return tableDate;
    }
  }

  //处理传感器类型数据所有筛选条件
  handleSensorTypeData = () => {
    let aftersensorTypes = [];
    const { sensorTypes } = this.props;
    if(sensorTypes.size !== 0){
      aftersensorTypes =  sensorTypes.map((item,index) => (
        item.get('type_name')
      ))
    }
    return aftersensorTypes;
  }

  //在选择传感器型号的时候，若没有选择传感器型号则会提示
  onFocus = () => {
    if(this.state.sensorModels.length === 0){
      message.warning("请检查是否选择传感器类型");
    }
  }

  addsensorTypes = () => {
    let addsensorTypes = [];
    const { usingSensorTypes } = this.props;
    if(usingSensorTypes.size !== 0){
      addsensorTypes = usingSensorTypes.map((item,index) => (
          item.get('type_name')
      ))
    }
    return addsensorTypes;
  }


  render() {
    const { whetherTest, addTypeVisible, addModelVisible, addCodeVisible, isLoading, 
      showPagination, total, currentPage, key1, key2, key3, editvisible, editInfo, sensorModels, size, sensorEditVisible } =this.state;
    const tableDate = this.handleData();
    const aftersensorTypes = this.handleSensorTypeData();
    const addsensorTypes = this.addsensorTypes();

    const { roleData } = this.props
    if (roleData.size === 0 ) return null

    return (
      <div>
        <div className='name'>传感器信息：</div>
          <div className='wrapper'>
            <div className='sensorfnc'>
              <div className="firstselectWrapper" >
                <div className="input" >传感器类型:</div>
                  <Select 
                    className='select' 
                    onSelect={(string) => this.handleSensorModel(string)} 
                    key={ key1 }
                    allowClear
                  >
                    {aftersensorTypes.size !== 0? aftersensorTypes.map((item) => <Option key={item} value={item}>{item}</Option>) : null}
                  </Select>
                </div>
              <div className="selectWrapper" >                  
                <div className="input" >传感器型号:</div>
                  <Select 
                     showSearch
                      className='select' 
                      onSelect={(string) => this.setState({searchSensorModel:string})} 
                      key={ key2 }
                      allowClear
                      optionFilterProp="children"
                      onFocus={ this.onFocus }
                      filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      sensorModels.size !== 0? 
                      sensorModels.map((item) => <Option key={item.sensor_model} value={item.sensor_model}>{item.sensor_model}</Option>) 
                      : null
                    }
                  </Select>
              </div>
              <div className="selectWrapper" >
                <div className="input" >传感器编号:</div>
                <Input  
                  style={{ width: "200px" }} 
                  name='searchSensorCode'
                  value={ this.state.searchSensorCode } 
                  onChange={ this.handleChange }
              />
              </div>
              <div className="selectWrapper" >
                <div className="input" >状态:</div>
                <Select 
                  style={{ width: "200px" }} 
                  onSelect={ (string) => this.setStatus(string) }
                  key={ key3 }
                  allowClear
                >
                  <Option value="1">正在使用</Option>
                  <Option value="2">未使用</Option>
                  <Option value="0">报废</Option>
                </Select>
              </div>
              <div className="line"></div>
              <div style={{marginTop: "15px"}}>
                  <Button onClick={this.searchInfo}>搜索</Button>
                  <Button className="button" onClick={this.handleReset} >重置</Button>
                  { roleData.map((item,index) => {
                    if ( item === 'sensor_manage') {
                      return  <span key={index} className='script'>
                              <Button type="primary" className="button" onClick={() => this.showModal('type')} >新增传感器类型</Button>
                              <Button type="primary" className="button" onClick={() => this.showModal('model')}>新增传感器型号</Button>
                              <Button type="primary" className="button" onClick={() => this.showModal('code')}>新增传感器</Button>
                              <Button type="danger" className="button" onClick={() => this.showModal('sensor')}>管理传感器类型和型号</Button>
                              </span>
                    }
                    return null;
                  })}
              </div>
              <div>
              <TypeModal
                types = { addsensorTypes }
                whetherTest={ whetherTest }
                visible={ addTypeVisible }
                cancel={ this.closeModal }
              />
              <ModelModal 
                types = { addsensorTypes }
                typesAndAid = {this.props.sensorTypes}
                whetherTest={ whetherTest }
                visible={ addModelVisible } 
                cancel={ this.closeModal }
              />
              <CodeModal
                types = { addsensorTypes }
                whetherTest={ whetherTest }
                visible={ addCodeVisible }
                cancel={ this.closeModal } 
                getInfo={ this.getInfo }
                afterCreateOrEdit={ this.afterCreateOrEdit }
              />
              <EditModal
                whetherTest={ whetherTest }
                visible={ editvisible }
                cancel={ this.closeModal }
                editInfo={ editInfo }
                afterCreateOrEdit={ this.afterCreateOrEdit }
              />
              <SenosrEditModal 
                whetherTest={ whetherTest }
                visible={ sensorEditVisible }
                cancel={ this.closeModal }
                sensorTypes={ this.props.usingSensorTypes }
              />  
              </div>
            </div>
            <SensorTabel
              data={ tableDate }
              showPagination={ showPagination }
              isLoading={ isLoading }
              total={ total }
              changePage={ this.getPage }
              changeSize={ this.getSize }
              showEditModal={ this.showEditModal }
              currentPage={ currentPage }
              roleData = { roleData }
              size={ size }
            />

          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    sensorTypes: state.getIn(['index', 'sensorTypes']),
    usingSensorTypes: state.getIn(['index', 'usingSensorTypes']),
    roleData: state.getIn(['index', 'roleData']),
})

export default connect(mapStateToProps, null)(SensorInfo);