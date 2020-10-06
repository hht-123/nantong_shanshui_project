import React, { Component } from 'react';
import '../../../style/wrapper.less'
import './engine.less'
import EngineTable from './engineTable';
import { DatePicker,Button, Input, message, Modal } from 'antd';
import { Model } from "../../../dataModule/testBone";

const model = new Model();
const {RangePicker} = DatePicker;
const dataSize = 'middle';

class EngineInfo extends Component{
  constructor(props) {
    super (props);
    this.state = {
      confirmLoading: false,
      whetherTest: false,     //是否是测试  true为是 false为否
      url:'page/',
      showPagination: true,   //是否分页
      isLoading: false,       //是否加载
      data: [],               //表格数据 
      total: 15,              //一共有多少条数据
      keyValue: "",           //用于重置
      search_engine_code: "",   //主机编号
      search_begin_time: [],    //开始时间
      search_end_time:[],       //结束时间
      visible: false         //Modal是否显示
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleBeginTime = this.handleBeginTime.bind(this);
    this.handleEndTime = this.handleEndTime.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getPage = this.getPage.bind(this);
    this.getSize = this.getSize.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    let startParams = {
      currentPage: 1,
      page: 1,
      size: 10,
    }
    this.getCurrentPage(startParams);
  }
  //保存输入框的内容
  getCurrentPage(params) {
    for (let i in params) {
      if (params[i] === null) {
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
            data: response.data.data,
            currentPage: params['currentPage']
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
    console.log(dateString)
    this.setState({
      'end_time': dateString
    })
    console.log(this.state.end_time);
  }
  //重置按钮
  handleReset() {
    this.setState({
      search_engine_code: '',
      keyValue: new Date()
    })
  }
  //翻页获取内容
  getPage(page, pageSize) {
    let params = {
      page: page,
      size: pageSize
    }
    this.getCurrentPage(params);
  }
  //改变pageSIze获取内容
  getSize(current, size){
    let params = {
      page: current,
      size: size
    }
    this.getCurrentPage(params);
  }
  //显示弹窗
  showModal()  {
    this.setState({
      visible: true,
    });
  };
  //弹窗确定按钮事件
  handleOk() {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };
  //取消按钮事件
  handleCancel() {
    this.setState({
      visible: false,
    });
  };
  
  render() {
    const {data, isLoading, showPagination, size, total, confirmLoading, visible} = this.state;
    const tableDate = [];
    data.map((item) => {
      tableDate.push({
        key: item.aid,
        engine_code: item.engine_code,
        engine_name: item.engine_name,
        begin_time: item.begin_time,
        end_time: item.end_time,
        note: item.node,
        status: parseInt((item.status),0)===1? '在产': '停产',
      })
      return null;
    })

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
                    <Button type="primary" className="button">搜索</Button>
                    <Button type="primary" className="button" onClick={this.handleReset}>重置</Button>
                    <Button type="primary" className="button" onClick={this.showModal}>新增主机</Button>
                </div>
                <div>
                <Modal
                  title="新增主机"
                  visible={visible}
                  onOk={this.handleOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                >
                  <div>content</div>
                </Modal>
                </div>
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
            />
          </div>
        </div>
      </div>
    )
  }
}
export default EngineInfo;