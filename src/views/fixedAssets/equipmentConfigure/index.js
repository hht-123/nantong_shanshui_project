import React, { Component } from 'react';
import { DatePicker, Button, Input, message } from 'antd';
import '../../../style/wrapper.less';
import './style.less';
import ConfigureTalbe from './configureTable';
import { Model } from "../../../dataModule/testBone";
import { equipmentConfiureUrl } from '../../../dataModule/UrlList';

const model = new Model();
const { RangePicker } = DatePicker;

class EpuipmentConfigure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyValue: '' ,          //刷新搜索日期
            search: false,          //是否搜索
            currentPage: 1,         //当前页面
            size: 10,
            whetherTest: false,     //是否是测试  true为是 false为否
            showPagination: true,   //是否分页
            isLoading: false,       //表格是否加载
            data: [],               //表格数据 
            total: 0,               //一共有多少条数据
            search_engine_code:'',         //搜索主机编号
            search_equipment_code: '',     //搜索设备编号
            search_time: []                //搜索时间
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
        equipmentConfiureUrl,
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
    getparams(currentPage=1, size=10, engine_code=null, equipment_code=null, search_time=null) {
      console.log(search_time);
        let params = {};
        let begin_time = null;
        let end_time = null;
        if(search_time !== null) {
          [begin_time, end_time] = this.handleDate(search_time);
        }
        params = {
          currentPage,
          size,
          equipment_code,
          engine_code,
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

    //搜索的时间
    handleTime = (value, dateString) => {
        this.setState({
            search_time: dateString
        })
    }

    //搜索按钮
    searchInfo = () => {
        this.setState({search: true});
        const { search_engine_code, search_equipment_code, search_time } = this.state;
        let params = this.getparams( 1, 10, search_engine_code, search_equipment_code, search_time);
        this.getCurrentPage(params);
    }

    //重置按钮
    handleReset = () => {
        const params = this.getparams();
        this.getCurrentPage(params);
        this.setState({
            search_engine_code: null,
            keyValue: new Date(),
            search_equipment_code: null,
            search_time: null,
            currentPage: 1,
            search: false,
        })
    }

    //翻页获取内容
  getPage = (currentPage, pageSize) => {
    let [ search_engine_code, search_equipment_code, search_time ] =[null, null, null];
    if(this.state.search === true){
      search_engine_code = this.state.search_engine_code;
      search_equipment_code = this.state.search_equipment_code;
      search_time = this.state.search_time;
    }
    
    const params = this.getparams(currentPage, pageSize, search_engine_code, search_equipment_code, search_time)
    this.getCurrentPage(params);
  }

  //改变pageSIze获取内容
  getSize = (current, size) => {
    let [ search_engine_code, search_equipment_code, search_time ] =[null, null, null];
    if(this.state.search === true){
      search_engine_code = this.state.search_engine_code;
      search_equipment_code = this.state.search_equipment_code;
      search_time = this.state.search_time;
    }
    
    const params = this.getparams(1, size, search_engine_code, search_equipment_code, search_time)
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0;
  }

  //处理获取后的数据
  handleData = () => {
    const { data } = this.state;
    if(data !== undefined) {
      console.log(data);
      const tableDate = data.map((item) =>({
          key: item.aid,
          alert_time: item.alert_time,
          equip_person: item.equip_person,
          engine_code: item.engine_code,
          engine_name: item.engine_name,
          equipment_code: item.equipment_code,
          storage_location: item.storage_location,   //库位
          storehouse: item.storehouse, 
        }))
      return tableDate;
    }
  }

    render() {
        const {isLoading, showPagination, size, total, currentPage} = this.state;
        const tableDate = this.handleData();
        console.log(this.state.data);

        return(
            <div>
                <div className='name'>设备配置记录：</div>
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
                            <div className="input" >主机编号:</div>
                            <Input  
                                style={{ width: "300px" }} 
                                name="search_engine_code" 
                                onChange={ this.handleChange }
                                value={ this.state.search_engine_code }
                            />
                        </div>
                        <div className="inputWrapper" >
                            <div className="input" >设备编号:</div>
                            <Input  
                            style={{ width: "300px" }} 
                            name="search_equipment_code" 
                            onChange={ this.handleChange }
                            value={ this.state.search_equipment_code }
                            />
                        </div>
                        <div className="line"></div>
                        <div style={{marginTop: "15px"}}>
                            <Button className="button" onClick={ this.searchInfo }>搜索</Button>
                            <Button className="button" onClick={ this.handleReset }>重置</Button>
                        </div>
                    </div>
                    <ConfigureTalbe 
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

export default EpuipmentConfigure;