import React, { Component } from 'react';
import '../../../style/wrapper.less'
import './style.less'
import EngineTable from './engineTable';
import { DatePicker,Button, Input, message } from 'antd';
import { Model } from "../../../dataModule/testBone";
import AddModal from './addModal';
import EditModal from './eidtModal';

const model = new Model();
const {RangePicker} = DatePicker;
const dataSize = 'middle';


class EngineInfo extends Component{
  constructor(props) {
    super (props);
    this.state = {
      confirmLoading: false,
      currentPage: 1,
      whetherTest: false,     //是否是测试  true为是 false为否
      url:'main_engine/',
      showPagination: true,     //是否分页
      isLoading: false,         //是否加载
      data: [],                 //表格数据 
      total: 0,                 //一共有多少条数据
      keyValue: "",             //用于重置
      search_engine_code: "",   //主机编号
      search_begin_time: [],    //开始时间
      search_end_time:[],       //结束时间
      addModalVisible: false,   //addModal是否显示
      editModalVisible:  false,  //editModal是否显示
      editInfo: {},             //获取到编辑行的信息
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleBeginTime = this.handleBeginTime.bind(this);
    this.handleEndTime = this.handleEndTime.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getPage = this.getPage.bind(this);
    this.getSize = this.getSize.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.searchInfo = this.searchInfo.bind(this);
  }


  componentDidMount() {
    let params = this.getparams();
    this.getCurrentPage(params);
  }
  //保存输入框的内容
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
      me.state.url,
      'get',
      function(response) {
        if (me.state.whetherTest === false) {
          me.setState({
            isLoading: false,
            total: response.data.count,
            data: response.data.results,
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

  getparams(currentPage=1, size=10, engine_code=null, search_begin_time=null, search_end_time=null) {
    let params = {};
    let begin_time_gte = null;
    let begin_time_lte = null;
    let end_time_gte = null;
    let end_time_lte = null;
    if(search_begin_time !== null){
      [begin_time_gte, begin_time_lte] = this.handleDate(search_begin_time);
    }
    if(search_end_time !== null){
      [end_time_gte, end_time_lte]= this.handleDate(search_end_time);
    }
    params = {
      currentPage,
      size,
      engine_code,
      begin_time_gte,
      begin_time_lte,
      end_time_gte,
      end_time_lte
    }
    return params;
  }
  //输入框的获取
  handleChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  //搜索的开始时间
  handleBeginTime(value, dateString) {
    this.setState({
      search_begin_time: dateString
    })
  }
  //搜索的结束时间
  handleEndTime(value, dateString) {
    this.setState({
      search_end_time: dateString
    })
  }
  //重置按钮
  handleReset() {
    let params = this.getparams();
    this.getCurrentPage(params);
    this.setState({
      search_engine_code: null,
      keyValue: new Date(),
      search_begin_time: null,
      search_end_time:null,
      currentPage:1
    })
    this.getCurrentPage(params);
  }
  //翻页获取内容
  getPage(currentPage, pageSize) {
    const {search_engine_code, search_begin_time, search_end_time} = this.state;
    let params = this.getparams(currentPage,pageSize,search_engine_code,search_begin_time,search_end_time)
    this.getCurrentPage(params);
  }
  //改变pageSIze获取内容
  getSize(current, size){
    const {search_engine_code, search_begin_time, search_end_time} = this.state;
    let params = this.getparams(1,size,search_engine_code,search_begin_time,search_end_time)
    this.setState({currentPage:1})
    this.getCurrentPage(params);
  }
  //显示增加弹窗
  showAddModal()  {
    this.setState({
      addModalVisible: true,
    });
  };
  //关闭弹窗
  closeModal(visible) {
    this.setState({
      addModalVisible: visible,
      editModalVisible: visible
    })
  }
  //显示编辑弹窗 text为改行的内容
  showEditModal(record) {
    this.setState({
      editModalVisible: true,
    });
    record === undefined? null :
    this.setState({
      editInfo:record
    })
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
  searchInfo() {
    const {search_engine_code, search_begin_time, search_end_time} = this.state;
    let params = this.getparams(1,10,search_engine_code,search_begin_time,search_end_time);
    this.getCurrentPage(params);
  }
  
  render() {
    const {data, isLoading, showPagination, size, total, addModalVisible , editModalVisible, whetherTest, editInfo, currentPage} = this.state;
    const tableDate = [];
    if(data !== undefined) {
      data.map((item) => {
        tableDate.push({
          key: item.aid,
          engine_code: item.engine_code,
          engine_name: item.engine_name,
          begin_time: item.begin_time,
          end_time: item.end_time,
          note: item.node,
          status: this.statusSWift(item.status),
        })
        return null;
      })
    }
    
    
    return (
      <div>
        <div className='name'>主机信息：</div>
        <div className='wrapper'>
        <div className='dateWrapper func'>
            <div>
              <div style={{float: 'left'}} >
                  <div className="input" >开始生产日期:</div>
                  <RangePicker 
                    key={this.state.keyValue}
                    size={dataSize}
                    onChange={this.handleBeginTime} 
                  />
              </div>
              
              <div className="inputWrapper" >
                  <div className="input" >结束生产日期:</div>
                  <RangePicker 
                    key={this.state.keyValue}
                    size={dataSize} 
                    onChange={this.handleEndTime}
                  />
              </div>

              <div className="inputWrapper" >
                  <div className="input" >主机编号:</div>
                  <Input  
                    style={{width: "300px"}} 
                    name="search_engine_code" 
                    onChange={this.handleChange}
                    value={this.state.search_engine_code}
                  />
              </div>
              </div>
                <div className="line"></div>
                <div style={{marginTop: "15px"}}>
                    <Button type="primary" className="button" onClick={this.searchInfo}>搜索</Button>
                    <Button type="primary" className="button" onClick={this.handleReset}>重置</Button>
                    <Button type="primary" className="button" onClick={this.showAddModal}>新增主机</Button>
                </div>
                <AddModal
                  whetherTest={whetherTest}
                  visible={addModalVisible}
                  cancel={this.closeModal}
                />
            </div>
          <div className='tableWrapper'>
            <EngineTable
              data={tableDate}
              isLoading={isLoading}
              showPagination={showPagination}
              size={size}
              total={total}
              changePage={this.getPage}
              changeSize={this.getSize}
              showEditModal={this.showEditModal}
              currentPage={currentPage}
            />
            <EditModal
              whetherTest={whetherTest}
              visible={editModalVisible}
              cancel={this.closeModal}
              showEditModal={this.showEditModal}
              editInfo={editInfo}
            />
            
          </div>
        </div>
      </div>
    )
  }
}
export default EngineInfo;