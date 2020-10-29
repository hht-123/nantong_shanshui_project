import React, { Component } from 'react';
import { Input, Button, message, Select } from 'antd';
import '../../../style/wrapper.less'
import './style.less'
import EquipmentTable from './equipmentTable';
import { Model } from "../../../dataModule/testBone";
import { epuipmentInfoUrl, sensorOfequipmentUrl } from '../../../dataModule/UrlList';
import EngineSensorModal from './modal/engineSensorModal';
import CreateModal from './modal/createModal';
import EditModal from './modal/editModal';
import ScrapModal from './modal/scrapModal';
import AllocationModal from './modal/allocationModal'
import { connect } from 'react-redux';

const { Option } = Select;
const model = new Model();

class EpuipmentInfo extends Component {
  constructor(props) {
      super(props);
      this.state = {
        key: '',
        search: false,                //是否搜索
        whetherTest: false,           //是否是测试  true为是 false为否
        sensorModalVisiable: false,   //是否显示传感器弹窗
        showPagination: true,         //是否分页
        searchEngineCode: '',         //搜索主机编号
        searchEquipmentCode: '',      //搜索设备编号
        status: '',                   //搜索的状态
        isLoading: false,             //是否加载
        data: [],                     //表格数据
        sensorModalData: [],          //传感器数据
        sensorTitle: '',              //当前传感器的设备的名称  编辑
        currentPage: 1,               //当前页面
        size: 10,
        total: 0,                     //一共有多少条数据
        createVisible: false,         //显示创建弹窗
        editVisible: false,           //显示编辑弹窗
        currentEnquimentInfo: {},     //需要编辑的当前设备信息
        scrapListVisible: false,      //显示需填写的报废单
        scrapEquipmentInfo:{},        
        allocationListVisible: false, //显示需填写的调拨单
        allocationEqiipmentInfo:{}
      }
  }

  getparams(currentPage=1, size=10, status=1, searchEngineCode=null, searchEquipmentCode=null) {
    const params = {
      currentPage,
      size,
      status,
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
            size: params['size'],
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
    let status = 1;
    if(this.state.search === true){
      searchEngineCode = this.state.searchEngineCode;
      searchEquipmentCode = this.state.searchEquipmentCode;
      status = this.state.status;
    }
    const params = this.getparams(currentPage, pageSize, status, searchEngineCode, searchEquipmentCode);
    this.getCurrentPage(params);
  }

  //改变pageSize获取内容
  getSize = (current, size) => {
    let [searchEngineCode, searchEquipmentCode] = [null, null];
    let status = 1;
    if(this.state.search === true){
      searchEngineCode = this.state.searchEngineCode;
      searchEquipmentCode = this.state.searchEquipmentCode;
      status = this.state.status;
    }
    const params = this.getparams(1, size, status, searchEngineCode, searchEquipmentCode);
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0;
  }

  //
  afterCreateOrEdit = () => {
    let [searchEngineCode, searchEquipmentCode] = [null, null];
    let status = 1;
    const { size, currentPage } = this.state; 
    if(this.state.search === true){
      searchEngineCode = this.state.searchEngineCode;
      searchEquipmentCode = this.state.searchEquipmentCode;
      status = this.state.status;
    }
    const params = this.getparams(currentPage, size, status, searchEngineCode, searchEquipmentCode);
    this.getCurrentPage(params);
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
      status: '1',
      key: new Date(),
    })
  }

  //搜索
  searchInfo = () => {
    this.setState({search: true});
    const {searchEngineCode, searchEquipmentCode, status} = this.state;
    let params = this.getparams( 1, 10, status, searchEngineCode, searchEquipmentCode);
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
      case 'create':
        this.setState({createVisible: true});
        break;
      case 'edit':
        this.getSensorInfo({equipment_id: record.key});
        this.setState({
          editVisible: true,
          currentEnquimentInfo: record,
        });
        break;
      case 'scrap':
        this.setState({
          scrapListVisible: true,
          scrapEquipmentInfo: record,
        })
        break;
      case 'allocation':
        this.setState({
          allocationListVisible: true,
          allocationEqiipmentInfo: record,
        })
        break;
      default:
        return 0;
    }
  }
  
  //关闭所有弹窗
  closeModal = () => {
    this.setState({
      sensorModalVisiable: false,
      createVisible: false,
      editVisible: false,
      scrapListVisible: false,
      allocationListVisible: false,
    })
  }

  //处理data数据
  handleData = () => {
    const { data } = this.state;
    if(data !== undefined) {
      const tableDate = data.map((item) => ({
              key: item.aid,
              engine_id: item.engine_id,
              equipment_code: item.equipment_code,
              engine_name: item.engine_name,
              engine_code: item.engine_code,
              storehouse: item.storehouse,
              storage_location: item.storage_location,
              note: item.note,
              status: item.status,
              equip_person: item.equip_person,
            }))
            return tableDate;
          }
  }

  
  render() {
    const { searchEngineCode, searchEquipmentCode, isLoading, showPagination, size, 
      total, sensorModalVisiable, currentPage, sensorModalData, sensorTitle, createVisible, 
      editVisible, currentEnquimentInfo, scrapListVisible, scrapEquipmentInfo, allocationListVisible, 
      allocationEqiipmentInfo, key} = this.state;
    const tableDate = this.handleData();
    const { roleData } = this.props
    if (roleData.size === 0 ) return null

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

              <div className="inputWrapper" >
                <div className="input" >状态:</div>
                <Select 
                    style={{ width: 200}}
                    // onSelect={(string) => this.handleSelect(string)} 
                    key={key}
                    defaultValue="1" 
                >
                    <Option key="1" value="1">在线</Option>
                    <Option key="2" value="2">调拨</Option>
                    <Option key="0" value="0">报废</Option>
                </Select>
              </div>

            <div className="line"></div>
            <div style={{marginTop: "15px"}}>
                  <Button className="button" onClick={this.searchInfo}>搜索</Button>
                  <Button className="button" onClick={this.handleReset}>重置</Button>
                  {  roleData.map((item,index) => {
                    if ( item === 'equipment_manage') {
                      return <Button type="primary" className="button" onClick={() => this.showModal('create')} key={index}>新增设备</Button>
                    }
                    return null;
                  })}
            </div>
            <CreateModal 
              visible={ createVisible }
              closeModal={ this.closeModal }
              afterCreateOrEdit={ this.afterCreateOrEdit }
            />
            <EditModal 
              visible={ editVisible }
              closeModal={ this.closeModal }
              data={ currentEnquimentInfo }
              sensorModalData={ sensorModalData }
              afterCreateOrEdit={ this.afterCreateOrEdit }
            />
          </div>
            <EquipmentTable 
              data={ tableDate }
              isLoading={ isLoading }
              showPagination={ showPagination }
              size={ size }
              total={ total }
              changePage={ this.getPage }
              changeSize={ this.getSize }
              showModal = {this.showModal}
              currentPage={ currentPage }
              roleData = { roleData }
            />
            <div>
              <EngineSensorModal 
                visible={ sensorModalVisiable }
                title={ sensorTitle }
                closeModal={ this.closeModal }
                data={ sensorModalData }
              />
              {/* 加这里 */}
              <ScrapModal 
                visible={ scrapListVisible }
                closeModal={ this.closeModal }
                data = { scrapEquipmentInfo }
              />
              <AllocationModal
                visible={ allocationListVisible }
                closeModal={ this.closeModal }
                data = { allocationEqiipmentInfo }
              />
            </div>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  roleData: state.getIn(['index', 'roleData']),
})

export default connect(mapStateToProps, null)(EpuipmentInfo);