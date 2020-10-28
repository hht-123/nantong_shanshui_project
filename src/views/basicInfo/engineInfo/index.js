import React, { Component } from 'react';
import '../../../style/wrapper.less'
import './style.less'
import EngineTable from './engineTable';
import { DatePicker, Button, Input, message, Select  } from 'antd';
import { Model } from "../../../dataModule/testBone";
import AddModal from './addModal';
import EditModal from './editModal';
import { enginInfoUrl } from '../../../dataModule/UrlList'

const { Option } = Select;
const model = new Model();
const { RangePicker } = DatePicker;
const dataSize = 'middle';

class EngineInfo extends Component{
  constructor(props) {
    super (props);
    this.state = {
      search: false,            //是否搜索
      currentPage: 1,
      size: 10,                  
      whetherTest: false,       //是否是测试  true为是 false为否
      showPagination: true,     //是否分页
      isLoading: false,         //表格是否加载
      data: [],                 //表格数据 
      total: 0,                 //一共有多少条数据
      keyValue: "",             //用于重置
      search_engine_code: "",   //主机编号
      search_begin_time: [],    //开始时间
      search_end_time:[],       //结束时间
      status: 0,                //状态
      addModalVisible: false,   //addModal是否显示
      editModalVisible:  false,  //editModal是否显示
      editInfo: {},             //获取到编辑行的信息
    }
  }


  componentDidMount() {
    let params = this.getparams();
    this.getCurrentPage(params);
  }

  //数据请求
  getCurrentPage = (params) => {
    for (let i in params) {
      if (params[i] === undefined || params[i] === null) {
        params[i] = ''
      }
    }
    let me = this;
    this.setState({isLoading: true})
    model.fetch(
      params,
      enginInfoUrl,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
          me.setState({
            isLoading: false,
            total: response.data.count,
            data: response.data.results,
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

  getparams(currentPage=1, size=10, status=1, engine_code=null, search_begin_time=null, search_end_time=null) {
    let params = {};
    let begin_time_gte = null;
    let begin_time_lte = null;
    let end_time_gte = null;
    let end_time_lte = null;
    if(search_begin_time !== null) {
      [begin_time_gte, begin_time_lte] = this.handleDate(search_begin_time);
    }
    if(search_end_time !== null) {
      [end_time_gte, end_time_lte] = this.handleDate(search_end_time);
    }
    params = {
      currentPage,
      size,
      engine_code,
      begin_time_gte,
      begin_time_lte,
      end_time_gte,
      end_time_lte,
      status
    }
    return params;
  }

  //输入框的获取
  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  //搜索的开始时间
  handleBeginTime = (value, dateString) => {
    this.setState({
      search_begin_time: dateString
    })
  }

  //搜索的结束时间
  handleEndTime = (value, dateString) => {
    this.setState({
      search_end_time: dateString
    })
  }

  //翻页获取内容
  getPage = (currentPage, size) => {
    let [ search_engine_code, search_begin_time, search_end_time ] =[null, null, null];
    let status = 1;
    if(this.state.search === true){
      search_engine_code = this.state.search_engine_code;
      search_begin_time = this.state.search_begin_time;
      search_end_time = this.state.search_end_time;
      status = this.state.status;
    }
    
    const params = this.getparams(currentPage, size, status, search_engine_code, search_begin_time, search_end_time)
    this.getCurrentPage(params);
  }

  //改变pageSIze获取内容
  getSize = (current, size) => {
    let [ search_engine_code, search_begin_time, search_end_time ] =[null, null, null];
    let status = 1;
    if(this.state.search === true){
      search_engine_code = this.state.search_engine_code;
      search_begin_time = this.state.search_begin_time;
      search_end_time = this.state.search_end_time;
      status = this.state.status;
    }
    const params = this.getparams(1, size, status, search_engine_code, search_begin_time, search_end_time)
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0;
  }

  //编辑之后保持搜索条件不变
  afterCreateOrCreate = () => {
    let [ search_engine_code, search_begin_time, search_end_time ] =[null, null, null];
    let status = 1;
    const { size, currentPage } = this.state;
    if(this.state.search === true){
      search_engine_code = this.state.search_engine_code;
      search_begin_time = this.state.search_begin_time;
      search_end_time = this.state.search_end_time;
      status = this.state.status;
    }
    const params = this.getparams(currentPage, size, status, search_engine_code, search_begin_time, search_end_time);
    this.getCurrentPage(params);
  }

  //显示增加弹窗
  showAddModal = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  //关闭弹窗
  closeModal = (visible) => {
    this.setState({
      addModalVisible: visible,
      editModalVisible: visible
    })
  }

  //显示编辑弹窗 text为改行的内容
  showEditModal = (record) => {
    this.setState({
      editModalVisible: true,
    });
    // eslint-disable-next-line no-unused-expressions
    record === undefined ? null : this.setState({editInfo:record})
  }

  statusSWift(status) {
    if(status === '1'){
      return '在产'
    }else if(status === '0'){
      return '停产'
    }
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
    this.setState({search: true});
    const { search_engine_code, search_begin_time, search_end_time, status } = this.state;
    let params = this.getparams( 1, 10, status, search_engine_code, search_begin_time, search_end_time);
    this.getCurrentPage(params);
  }

  //重置按钮
  handleReset = () => {
    const params = this.getparams();
    this.getCurrentPage(params);
    this.setState({
      search_engine_code: null,
      keyValue: new Date(),
      search_begin_time: null,
      search_end_time: null,
      currentPage: 1,
      search: false,
      status: 1,
    })
  }
  //更改状态
  handlestatus = (string) => {
    this.setState({status: string});
  }

  handleData = () => {
    const { data } = this.state;
    if(data !== undefined) {
      const tableDate = data.map((item) =>({
          key: item.aid,
          engine_code: item.engine_code,
          engine_name: item.engine_name,
          begin_time: item.begin_time,
          end_time: item.end_time,
          note: item.note,
          status: this.statusSWift(item.status),
        }))
      return tableDate;
    }
  }


  
  render() {
    const {isLoading, showPagination, size, total, addModalVisible, editModalVisible, whetherTest, editInfo, currentPage, keyValue} = this.state;
    const tableDate = this.handleData();
    
    
    return (
      <div>
        <div className='name'>主机信息：</div>
        <div className='wrapper'>
          <div className='func'>
            <div>
              <div style={{ float: 'left' }} >
                <div className="input" >开始生产日期:</div>
                  <RangePicker 
                    style={{width: "250px"}}
                    key={ keyValue }
                    size={ dataSize }
                    onChange={ this.handleBeginTime } 
                  />
                </div>
              
              <div className="inputWrapper" >
                <div className="input" >结束生产日期:</div>
                <RangePicker
                  style={{width: "250px"}}
                  key={ keyValue }
                  size={ dataSize } 
                  onChange={ this.handleEndTime }
                />
              </div>

              <div className="inputWrapper" >
                <div className="input" >主机编号:</div>
                <Input  
                  style={{ width: "250px" }} 
                  name="search_engine_code" 
                  onChange={ this.handleChange }
                  value={ this.state.search_engine_code }
                />
                </div>
              </div>

              <div className="inputWrapper" >
                <div className="input" >状态:</div>
                <Select 
                  defaultValue="1" 
                  style={{ width: "200px" }} 
                  onSelect={ (string) => this.handlestatus(string) }
                  key={ keyValue }
                  >
                  <Option value="1">在产</Option>
                  <Option value="0">停产</Option>
                </Select>
              </div>

              <div className="line"></div>
              <div style={{marginTop: "15px"}}>
                <Button className="button" onClick={ this.searchInfo }>搜索</Button>
                <Button className="button" onClick={ this.handleReset }>重置</Button>
                <Button type="primary" className="button" onClick={ this.showAddModal }>新增主机</Button>
              </div>
              <AddModal
                whetherTest={ whetherTest }
                visible={ addModalVisible }
                cancel={ this.closeModal }
                getCurrentPage = { this.getCurrentPage }
                getparams = { this.getparams }
                afterCreateOrCreate={ this.afterCreateOrCreate }
              />
              </div>
            <div className='engineTableWrapper'>
              <EngineTable
                data={ tableDate }
                isLoading={ isLoading }
                showPagination={ showPagination }
                size={ size }
                total={ total }
                changePage={ this.getPage }
                changeSize={ this.getSize }
                showEditModal={ this.showEditModal }
                currentPage={ currentPage }
              />
              <EditModal
                whetherTest={ whetherTest }
                visible={ editModalVisible }
                cancel={ this.closeModal }
                editInfo={ editInfo }
                afterCreateOrCreate={ this.afterCreateOrCreate }
              />
            </div>
        </div>
      </div>
    )
  }
}
export default EngineInfo;