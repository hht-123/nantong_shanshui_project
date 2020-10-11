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
import { sensorInfoUrl } from '../../../dataModule/UrlList';
//类型 type
//型号 model
//编号

const model = new Model();
const { Option } = Select;
class SensorInfo extends Component {
  constructor(props){
      super (props);
      this.state = {
        search: false,            //是否搜索
        key:'',                   //重置select
        whetherTest: false,       //是否是测试  true为是 false为否
        SensorTypes: [],          //储存所有传感器类型
        sensorModels: [],          //储存所有传感器型号
        data: [],                 //储存所有传感器的信息
        searchSensorType: '',     //搜索传感器类型
        searchSensorModel: '',    //搜索传感器型号
        searchSensorCode: '',     //搜索传感器编号
        showPagination: true,     //是否分页 true为分页
        currentPage:1,            //当前页面
        pageSize: '',             //页面展示数量
        total:15,                 //页面的总量
        isLoading: false,         //表格是否显示加载中
        addTypeVisible: false,    //是否显示增加传感器类型弹窗
        addModelVisible: false,   //是否显示增加传感器型号弹窗
        addCodeVisible: false,    //是否显示增加传感器信息弹窗
        editvisible: false,       //是否显示编辑弹窗
        editInfo: {},             //获取当前行的信息
      } 
  }

  componentDidMount() {
    const params = this.getParams();
    this.getInfo('page',params);
  }

  getParams(currentPage=1, pageSize=10, searchSensorType=null, searchSensorModel=null, searchSensorCode=null) {
    const params = {
      currentPage,
      size: pageSize,
      type_name: searchSensorType,
      sensor_model: searchSensorModel,
      sensor_code: searchSensorCode,
    }
    return params;
  }

  //获取部件的信息，分页，获取所有传感器类型
  //name: 'page'表格页面请求, 'type'传感器类型请求  'model'传感器型号请求
  getInfo(name, params) {
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
          if(name === 'page'){
            me.setState({
              isLoading: false,
              total: response.data.count,
              data: response.data.data,
              currentPage: params['currentPage']
            })
          }else if (name === 'type') {
            me.setState({
              SensorTypes: response.data
            })
          }else if (name === 'model') {
            me.setState({
              sensorModels: response.data
            })
          }
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
  

  //获取对应传感器类型的型号
  getSensorModel= (string) => {
    this.setState({searchSensorType:string});
    const params = {type_name: string};
    // this.getInfo('model',params);
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
      default:
        return;
    }
  }

  //显示编辑窗口
  showEditModal = (record) => {
    this.setState({
      editvisible: true,
    });
    record === undefined ? null :
    this.setState({
      editInfo: record
    })
  }

  //关闭弹窗
  closeModal = () => {
    this.setState({
      addTypeVisible: false,
      addModelVisible: false,
      addCodeVisible: false,
      editvisible: false,
    })
  }

  //翻页获取内容
  getPage = (currentPage, pageSize) => {
    let [searchSensorType, searchSensorModel, searchSensorCode] = [null, null, null];
    if(this.state.search === true){
      searchSensorType = this.state.searchSensorType;
      searchSensorModel = this.state.searchSensorModel;
      searchSensorCode = this.state.searchSensorCode;
    }
    const params = this.getParams(currentPage, pageSize, searchSensorType, searchSensorModel, searchSensorCode)
    this.getInfo('page', params);
  }

  //改变pageSIze获取内容
  getSize = (current, size) => {
    let [searchSensorType, searchSensorModel, searchSensorCode] = [null, null, null];
    if(this.state.search === true){
      searchSensorType = this.state.searchSensorType;
      searchSensorModel = this.state.searchSensorModel;
      searchSensorCode = this.state.searchSensorCode;
    }
    const params = this.getParams(1, size, searchSensorType, searchSensorModel, searchSensorCode)
    this.getInfo('page', params);
    document.scrollingElement.scrollTop = 0
  }

  //重置按钮
  handleReset = () => {
    let params = this.getParams();
    this.getInfo('page',params);
    this.setState({
      searchSensorType: null,
      searchSensorModel: null,
      searchSensorCode: null,
      key:new Date(),
      search: false,
    })
  }

  //搜索按钮
  searchInfo = () => {
    this.setState({search: true});
    const { searchSensorType, searchSensorModel, searchSensorCode } = this.state;
    let params = this.getParams(1, 10, searchSensorType, searchSensorModel, searchSensorCode);
    this.getInfo(params);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  statusSWift(status) {
    if(status === '1'){
      return '可以使用'
    }else if(status === '0'){
      return '停止使用'
    }
  }

  render() {
    const { data, whetherTest, addTypeVisible, addModelVisible, addCodeVisible, isLoading, 
      showPagination, pageSize, total, currentPage, key, editvisible, editInfo} =this.state;
    const tableDate = [];

    if(data !== undefined) {
      data.map((item) => {
        tableDate.push({
          key: item.sensor_code,
          type_name: item.type_name,
          sensor_model: item.sensor_model,
          sensor_code: item.sensor_code,
          status: this.statusSWift(item.status),
          note: item.node,
        })
        return null;
      })
    }

    return (
      <div>
        <div className='name'>传感器信息：</div>
          <div className='wrapper'>
            <div className='sensorfnc'>
              <div className="firstselectWrapper" >
                <div className="input" >传感器类型:</div>
                  <Select 
                    className='select' 
                    onSelect={(string) => this.getSensorModel(string)} 
                    key={key}
                    allowClear
                  >
                    <Option value="PH值传感器">PH值传感器</Option>
                    <Option value="电导率传感器">电导率传感器</Option>
                    <Option value="浊度传感器">浊度传感器</Option>
                    <Option value="荧光度传感器">荧光度传感器</Option>
                    <Option value="COD传感器">COD传感器</Option>
                  </Select>
                </div>
              <div className="selectWrapper" >                  
                <div className="input" >传感器型号:</div>
                  <Select 
                    className='select' 
                    onSelect={(string) => this.setState({searchSensorModel:string})} 
                    key={key}
                    allowClear
                  >
                    <Option value="PBT">PBT</Option>
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="C">C</Option>
                    <Option value="D">D</Option>
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
              <div className="line"></div>
              <div style={{marginTop: "15px"}}>
                  <Button >搜索</Button>
                  <Button className="button" onClick={this.handleReset} >重置</Button>
                  <Button type="primary" className="button" onClick={() => this.showModal('type')}>新增传感器类型</Button>
                  <Button type="primary" className="button" onClick={() => this.showModal('model')}>新增传感器型号</Button>
                  <Button type="primary" className="button" onClick={() => this.showModal('code')}>新增传感器</Button>
              </div>
              <div>
              <TypeModal 
                whetherTest={ whetherTest }
                visible={ addTypeVisible }
                cancel={ this.closeModal }
              />
              <ModelModal 
                whetherTest={ whetherTest }
                visible={ addModelVisible }
                cancel={ this.closeModal }
              />
              <CodeModal
                whetherTest={ whetherTest }
                visible={ addCodeVisible }
                cancel={ this.closeModal } 
              />
              <EditModal
                 whetherTest={ whetherTest }
                 visible={ editvisible }
                 cancel={ this.closeModal }
                 editInfo={ editInfo }
              />
              </div>
            </div>
            <SensorTabel
               data={ tableDate }
              showPagination={ showPagination }
              isLoading={ isLoading }
              size={ pageSize }
              total={ total }
              changePage={ this.getPage }
              changeSize={ this.getSize }
               showEditModal={ this.showEditModal }
               currentPage={ currentPage }
            />
          </div>
      </div>
    )
  }
}

export default SensorInfo;