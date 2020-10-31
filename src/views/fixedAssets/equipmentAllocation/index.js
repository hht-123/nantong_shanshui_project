import React, { Component } from 'react';
import { DatePicker, Button, Input, message, Select} from 'antd';
import '../../../style/wrapper.less';
import AllocationTable from './allocationTable';
import { Model } from "../../../dataModule/testBone";
import { equipmentAllocation } from '../../../dataModule/UrlList';


const model = new Model();
const { Option } = Select;
const { RangePicker } = DatePicker;

class EpuipmentAllocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyValue: '' ,            //刷新搜索日期
            key: '',                //刷新下拉框
            search: false,            //是否搜索
            currentPage: 1,           //当前页面
            size: 10,
            whetherTest: false,       //是否是测试  true为是 false为否
            showPagination: true,     //是否分页
            isLoading: false,         //表格是否加载
            data: [],                 //表格数据 
            total: 0,                 //一共有多少条数据
            search_transfer_unit: '',  //客户单位
            search_status: '',        //设备状态
            search_time: [],          //搜索时间
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
        equipmentAllocation,
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

    //处理日期函数
    handleDate(preDate) {
        if(preDate !== undefined){
          let gte = preDate[0];
          let lte = preDate[1];
          return [gte,lte]
        }
      }

    //处理参数
    getparams(currentPage=1, size=10, transfer_unit=null, status=null, search_time=null) {
        let params = {};
        let begin_time = null;
        let end_time = null;
        if(search_time !== null) {
          [begin_time, end_time] = this.handleDate(search_time);
        }
        params = {
          currentPage,
          size,
          transfer_unit,
          status,
          begin_time,
          end_time
        }
        return params;
      }

    //输入框的获取
    handleChange = (e) => {
        this.setState({
        [e.target.name] : e.target.value
        })
    }

    //拉去框获取
    handleSelect = (string) => {
        this.setState({search_status: string});
    }

    //搜索的时间
    handleTime = (value, dateString) => {
        this.setState({
            search_time: dateString
        })
    }

    //搜索按钮
    searchInfo = () => {
        this.setState({search: true});
        const { search_transfer_unit, search_status, search_time } = this.state;
        let params = this.getparams( 1, 10, search_transfer_unit, search_status, search_time);
        console.log(search_status);
        this.getCurrentPage(params);
        
    }

    //重置按钮
    handleReset = () => {
        const params = this.getparams();
        this.getCurrentPage(params);
        this.setState({
            keyValue: new Date(),
            key: new Date(),
            search_status: null,
            search_transfer_unit: null,
            search_time: null,
            currentPage: 1,
            search: false,
        })
    }

    //翻页获取内容
  getPage = (currentPage, pageSize) => {
    let [ search_transfer_unit, search_status, search_time ] =[null, null, null];
    if(this.state.search === true){
        search_transfer_unit = this.state.search_transfer_unit;
        search_status = this.state.search_status;
        search_time = this.state.search_time;
    }
    const params = this.getparams(currentPage, pageSize, search_transfer_unit, search_status, search_time);
    this.getCurrentPage(params);
  }

  //改变pageSIze获取内容
  getSize = (current, size) => {
    let [ search_transfer_unit, search_status, search_time ] =[null, null, null];
    if(this.state.search === true){
        search_transfer_unit = this.state.search_transfer_unit;
        search_status = this.state.search_status;
        search_time = this.state.search_time;
    }
    const params = this.getparams(1, size, search_transfer_unit, search_status, search_time)
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0;
  }

  statusSWift(status) {
    if(status === '1'){
      return '在线'
    }else if(status === '3'){
      return '报修'
    }else if(status === '4'){
      return '维护'
    }
  }

  //处理获取后的数据
  handleData = () => {
    const { data } = this.state;
    console.log(data, 'data')
    if(data !== undefined) {
      const tableDate = data.map((item) =>({
          key: item.equipment_code,
          applicant_time: item.applicant_time,
          equipment_code: item.equipment_code,
          status: this.statusSWift(item.status),
          applicant: item.applicant,
          applicant_tel: item.applicant_tel,
          transfer_unit: item.transfer_unit,
          transfer_unit_tel: item.transfer_unit_tel,
          transfer_unit_ads: item.transfer_unit_ads,
          allocation_reason: item.allocation_reason,
        }))
      return tableDate;
    }
  }

    render() {
        const {isLoading, showPagination, size, total, currentPage, key} = this.state;
        const tableDate = this.handleData();

        
        console.log(tableDate, 'tableDate')
        return(
            <div>
                <div className='name'>设备调拨记录：</div>
                <div className='wrapper'>
                    <div className='func'>
                        <div style={{ float: 'left' }} >
                        <div className="input" >日期筛选:</div>
                        <RangePicker 
                            key={ this.state.keyValue }
                            onChange={ this.handleTime } 
                        />
                        </div>
                        <div className="inputWrapper" >
                            <div className="input" >调入单位:</div>
                            <Input  
                                style={{ width: "300px" }} 
                                name="search_transfer_unit" 
                                onChange={ this.handleChange }
                                value={ this.state.search_transfer_unit }
                            />
                        </div>
                        <div className="line"></div>
                        <div style={{marginTop: "15px"}}>
                            <Button className="button" onClick={ this.searchInfo }>搜索</Button>
                            <Button className="button" onClick={ this.handleReset }>重置</Button>
                        </div>
                    </div>
                    <AllocationTable 
                        data={ tableDate }
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
        )
    }
}

export default EpuipmentAllocation;