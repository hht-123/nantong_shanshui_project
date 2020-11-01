 import React,{ Component } from 'react';
import { Input, Button, message } from 'antd';
import '../../../style/wrapper.less';
import './style.less';
import  EquipmentScrapTable  from '../equipmentScrap/EquipmentScrapTable';
import { Model} from '../../../dataModule/testBone';
import { equipmentScrap, sensorOfequipmentUrl } from '../../../dataModule/UrlList';


const model = new Model();

class Equipment extends Component{

    constructor(props){
      super(props);
      this.state={
          confirmLoading: false,
          currentPage: 1,
          size: 10,
          isLoading: false,             //是否加载
          search: false,                //是否搜索
          whetherTest: false,           //是否是测试  true为是 false为否
          showPagination: true,         //是否分页
          data: [],                     //表格数据
          total: 0,                     //一共有多少条数据
          search_equipment_code: '',    //设备编号的搜索
          equipment_sensor: '',
      }  
  }

    //生命周期函数
    componentDidMount() {
        let params = this.getParams();
        this.getCurrentPage(params);
        // this.getSensorInfo({equipment_id: });
    }


    handleChange = (e) => {
        this.setState({
        [e.target.name] : e.target.value
        })
    }

    //获取当前设备传感器
    getSensorInfo = (params) => {
        let me = this;
        model.fetch(
        params,
        sensorOfequipmentUrl,
        'get',
        function(response) {
            console.log(response.data.data);
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

    //获取数据
    getCurrentPage(params) {
        for (let i in params) {
            if (params[i] === undefined || params[i] === null) {
            params[i] = ''
            }
        }
        let me = this;            //让this指向不会出错
        this.setState({isLoading: true})
        model.fetch(
            params,
            equipmentScrap,
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
                    // .log(me.state.data)
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

    getParams(currentPage = 1, size = 10, equipment_code = null) {
        let params = {};
        params = {
            equipment_code,
            currentPage,
            size,
        }
        return params;
    }

    //搜索按钮
    searchInfo = () => {
        this.setState({ search: true });
        const { search_equipment_code } = this.state;
        let params = this.getParams( 1, 10, search_equipment_code);
        this.getCurrentPage(params);
    }


    //重置按钮
    handleReset = () => {
        const params = this.getParams();
        this.getCurrentPage(params);
        this.setState({
            search_equipment_code: null,
            currentPage: 1,
            search: false,
        })
    }

    //翻页获取内容
  getPage = (currentPage, pageSize) => {
    let search_equipment_code = null;
    if(this.state.search === true){
        search_equipment_code = this.state.search_equipment_code;
    }
    
    const params = this.getParams(currentPage, pageSize, search_equipment_code)
    this.getCurrentPage(params);
  }

  //改变pageSIze获取内容
  getSize = (current, size) => {
    let search_equipment_code = null;
    if(this.state.search === true){
        search_equipment_code = this.state.search_equipment_code;
    }
    const params = this.getParams(1, size, search_equipment_code)
    this.getCurrentPage(params);
    document.scrollingElement.scrollTop = 0;
  }

    handleData = () => {
        const { data } = this.state;
        if(data !== undefined) {
          const tableDate = data.map((item) =>({
              key: item.aid,
              applicant_time: item.applicant_time,
              engine_code: item.engine_code,
              engine_name: item.engine_name,
              equipment_code: item.equipment_code,
              scrapping_reasons: item.scrapping_reasons,
              storage_location: item.storage_location,   //库位
              storehouse: item.storehouse,              //仓库
              remark: item.remark,
              applicant: item.applicant,
              applicant_tel: item.applicant_tel,
            }))
          return tableDate;
        }
    }

  render(){
    const { isLoading, showPagination, size, total, currentPage } = this.state;
    const tableDate = this.handleData();

    return(
        <div>
            <div className='name'>设备报废记录：</div>
            <div className='wrapper'>
                <div className='func' style={{height: 160}}>
                    <div className="inputWrapper" style={{ marginLeft: 0}}>
                        <div className="input">设备编号:</div>
                        <Input  
                            style={{ width: "200px"}} 
                            name="search_equipment_code" 
                            onChange={ this.handleChange }
                            value={ this.state.search_equipment_code }
                        />
                    </div>
                    <div style={{marginTop: "40px",marginLeft: "260px"}}>
                            <Button className="button" onClick={ this.searchInfo }>搜索</Button>
                            <Button className="button" onClick={ this.handleReset }>重置</Button>
                    </div>
                </div>
                <EquipmentScrapTable
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

export default Equipment;