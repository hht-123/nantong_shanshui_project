 import React,{ Component } from 'react';
import { Input, Button, message } from 'antd';
import '../../style/wrapper.less';
import './style/seneor.less';
import  EquipmentScrapTable  from '../equipmentScrap/EquipmentScrapTable';
import { Model} from '../../dataModule/testBone';

const model = new Model();

class Equipment extends Component{

    constructor(props){
      super(props);
      this.state={
          confirmLoading: false,
          currentPage: 1,
          isLoading: false,         //是否加载
          search: false,          //是否搜索
          whetherTest: false,     //是否是测试  true为是 false为否
          showPagination: true,   //是否分页
          data: [],               //表格数据 
          total: 0,              //一共有多少条数据
          keyValue: "",           //用于重置
          search_equipment_code: "",        //客户单位
          Visible: false,   //addMesCustomer是否显示
          editModelVisible: false , //editModal是否显示
          editInfo: {},             //获取到编辑行的信息
      }  
  }

  //生命周期函数
  componentDidMount() {
    let params = this.getParams();
    this.getCurrentPage(params);
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
        '',
        'get',
        function(response) {
            if (me.state.whetherTest === false) {
                me.setState({
                    isLoading: false,
                    total: response.data.count,
                    data: response.data.results,
                    currentPage: params['currentPage']
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

getParams( currentPage = 1, size = 10, client_code = null, client_unit=null  ) {
    let params = {};
    params = {
        currentPage,
        size,
        client_code,
        client_unit,
    }
    return params;
}



  render(){
    const {data ,} = this.state;
        const tableDate = [];
        if(data !== undefined){
            data.map((item) => {
            tableDate.push({
                key: item.aid,
                create_time:item.create_time,
                engine_code:item.engine_code,
                equipment_code:item.equipment_code,
                storehouse:item.storehouse,
                storage_location:item.storage_location,
                note: item.note
            })
            return null;
        })
    }

    return(
      <div>
        <div className="name">设备报废信息</div>
        <div  className="wrapper">
                        <div className="style">
                            <div className="text">设备报废：</div>
                            <div className="div">
                                <div className="left">
                                    <Input  
                                        style={{width: "200px"}} 
                                        name="search_client_unit" 
                                        onChange={this.handleChange}
                                        value={this.state.search_client_unit}
                                    />
                                </div>
                                <div>
                                    <div className="right">
                                        <Button  type="primary" className="span" onClick={ this.searchInfo }>搜索</Button>
                                        <Button  type="primary" className="span" onClick={this.handleReset}>重置</Button>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <div className="table">
                            <EquipmentScrapTable
                                data={ tableDate }
                                isLoading={ this.state.isLoading }
                                showPagination={ this.state.showPagination }
                                size={ this.state.size }
                                total={ this.state.total }
                                changePage={ this.getPage }
                                changeSize={ this.getSize }
                                currentPage={ this.state.currentPage }
                            />
                        </div> 
                </div> 
      </div>
    )
  }
}

export default Equipment;