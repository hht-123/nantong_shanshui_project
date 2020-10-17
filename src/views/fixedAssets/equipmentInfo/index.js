import React, { Component } from 'react';
import { Input, Button, message } from 'antd';
import '../../../style/wrapper.less'
import './style.less'
import EquipmentTable from './equipmentTable';
import { Model } from "../../../dataModule/testBone";
import { epuipmentInfoUrl, sensorOfequipmentUrl } from '../../../dataModule/UrlList';
import EngineSensorModal from './modal/engineSensorModal';

const model = new Model();

class EpuipmentInfo extends Component {
  constructor(props) {
      super(props);
      this.state = {
        search: false,                //是否搜索
        whetherTest: false,           //是否是测试  true为是 false为否
        sensorModalVisiable: false,   //是否显示传感器弹窗
        showPagination: true,         //是否分页
        searchEngineCode: '',         //搜索主机编号
        searchEquipmentCode: '',      //搜索设备编号
        isLoading: false,             //是否加载
        data: [],                     //表格数据
        sensorModalData: [],          //传感器数据
        sensorTitle: '',              //当前传感器的设备的名称
        currentPage: 1,               //当前页面
        total: 0,                     //一共有多少条数据
      }
  }

  getparams(currentPage=1, size=10, searchEngineCode=null, searchEquipmentCode=null) {
    const params = {
      currentPage,
      size,
      engine_code: searchEngineCode,
      equipment_code: searchEquipmentCode,
    }

    return params;
  }

  componentDidMount() {
    const params = this.getparams();
    this.getCurrentPage(params);
  }

  //获得当前页的内容
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
      epuipmentInfoUrl,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
          me.setState({
            isLoading: false,
            total: response.data.count,
            data: response.data.data,
            currentPage: params['currentPage'],
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

  //获取当前设备传感器
  getSensorInfo = (params) => {
    let me = this;
    model.fetch(
      params,
      sensorOfequipmentUrl,
      'get',
      function(response) {
          me.setState({
            sensorModalData: response.data.data
          })
      },
      function() {
        message.warning('加载失败，请重试')
      },
      this.state.whetherTest
    )
  }

  //获取翻页内容
  getPage = (currentPage, pageSize) => {
    let [searchEngineCode, searchEquipmentCode] = [null, null];
    if(this.state.search === true){
      searchEngineCode = this.state.searchEngineCode;
      searchEquipmentCode = this.state.searchEquipmentCode;
    }
    const params = this.getparams(currentPage, pageSize, searchEngineCode, searchEquipmentCode);
    this.getCurrentPage(params);
  }

  //改变pageSize获取内容
  getSize = (current, size) => {
    let [searchEngineCode, searchEquipmentCode] = [null, null];
    if(this.state.search === true){
      searchEngineCode = this.state.searchEngineCode;
      searchEquipmentCode = this.state.searchEquipmentCode;
    }
    const params = this.getparams(1, size, searchEngineCode, searchEquipmentCode);
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0;
  }

  //获取输入框内容
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //重置
  handleReset = () => {
    const params = this.getparams();
    this.getCurrentPage(params);
    this.setState({
      searchEngineCode: '',
      searchEquipmentCode: '',
    })
  }

  //搜索
  searchInfo = () => {
    this.setState({search: true});
    const {searchEngineCode, searchEquipmentCode} = this.state;
    let params = this.getparams( 1, 10, searchEngineCode, searchEquipmentCode);
    this.getCurrentPage(params);
  }

  //显示弹窗
  showModal = (name, record = null) => {
    switch(name) {
      case 'sensor':
        this.setState({sensorModalVisiable: true});
        this.getSensorInfo({equipment_id: record.key});
        this.setState({sensorTitle: record.equipment_code});
        break;
    }
  }
  
  //关闭所有弹窗
  closeModal = () => {
    this.setState({
      sensorModalVisiable: false,
    })
  }

  //处理data数据
  handleData = () => {
    const { data } = this.state;
    if(data !== undefined) {
      const tableDate = data.map((item) => ({
              key: item.aid,
              equipment_code: item.equipment_code,
              engine_name: item.engine_name,
              engine_code: item.engine_code,
              storehouse: item.storehouse,
              storage_location: item.storage_location,
              note: item.note,
            }))
            return tableDate;
          }
    }
  
  render() {
    const { searchEngineCode, searchEquipmentCode, isLoading, showPagination, size, 
      total, sensorModalVisiable, currentPage, sensorModalData, sensorTitle} = this.state;
    const tableDate = this.handleData();


    return(
      <div>
        <div className='name'>设备信息：</div>
        <div className='wrapper'>
          <div className='func'>
            <div style={{ float: 'left' }} >
              <div className="input" >主机编号:</div>
                <Input  
                  style={{ width: "220px" }} 
                  name="searchEngineCode" 
                  value={searchEngineCode}
                  onChange={ this.handleChange }
                  // value={ this.state.search_engine_code }
                />
              </div>
              <div className="inputWrapper" >
                <div className="input" >设备编号:</div>
                <Input  
                  style={{ width: "220px" }} 
                  name="searchEquipmentCode" 
                  value={searchEquipmentCode}
                  onChange={ this.handleChange }
                  // value={ this.state.search_engine_code }
                />
              </div>
            <div className="line"></div>
            <div style={{marginTop: "15px"}}>
                  <Button className="button" onClick={this.searchInfo}>搜索</Button>
                  <Button className="button" onClick={this.handleReset}>重置</Button>
                  <Button type="primary" className="button">新增设备</Button>
            </div>
          </div>
            <EquipmentTable 
              className='tableWrapper'
              data={ tableDate }
              isLoading={ isLoading }
              showPagination={ showPagination }
              size={ size }
              total={ total }
              changePage={ this.getPage }
              changeSize={ this.getSize }
              showSensorModal = {this.showModal}
              currentPage={ currentPage }
            />
            <div>
              <EngineSensorModal 
                visible={ sensorModalVisiable }
                title={ sensorTitle }
                closeModal={ this.closeModal }
                data={ sensorModalData }
              />
            </div>
          </div>
      </div>
    )
  }
}

export default EpuipmentInfo;