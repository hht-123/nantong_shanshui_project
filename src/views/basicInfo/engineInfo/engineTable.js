import { Table, Pagination, message} from 'antd';
import React, { Component } from 'react';
import { Model } from "../../../dataModule/testBone";


const model = new Model()

class EngineTable extends Component{
    constructor(props) {
      super (props);
      this.state = {
        currentPage: 1,         //当前页面
        isLoading: false,       //是否加载
        data: [],               //表格数据 
        total: 15,              //一共有多少条数据
        pageSize: 5,            //每页展示几条数据
        showPagination: true,   //是否使用分页
      }
      this.totalPages = (parseInt(this.state.total / this.state.pageSize, 0) + 1);
      this.changePage = this.changePage.bind(this);
    }

    componentDidMount() {
      this.getCurrentPage();
    }

    //父组件需要传递 url，whetherTest
    getCurrentPage(params) {
      let whetherTest = true;
      const me = this;
      me.setState({isLoading: true})
      model.fetch(
        {currentPage: 2},
        'api/engine.json',
        'get',
        function(response) {
          if (whetherTest === false) {
            me.setState({
              isLoading: false,
              total: response.data.count,
              data: response.data.results,
              currentPage: params['currentPage']
            })
          } else {
            me.setState({
              isLoading: false,
              data: response.data.data,
              total: response.data.count,
            })
          }
        },
        function() {
          message.warning('加载失败，请重试')
        },
        whetherTest
      )
    }

    changePage(page) {
      
    }
    
    render() {
      const {total, pageSize, showPagination, isLoading, data} = this.state;
      const changePage = this.changePage;
      //计算一共有多少页面
      
      const columns =  [
          {
            title: '主机编号',
            dataIndex: 'engine_code',
            align: 'center',
            width: 100
          },
          {
            title: '主机名称',
            dataIndex: 'engine_name',
            align: 'center',
            width: 120
          },
          {
            title: '开始生产时间',
            dataIndex: 'begin_time',
            align: 'center',
            width: 120
          },
          {
            title: '结束生产时间',
            dataIndex: 'end_time',
            align: 'center',
            width: 120
          },
          {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            width: 80,
          },
          {
            title: '备注',
            dataIndex: 'note',
            align: 'center'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 80
          }
        ];

        return (
          <div 
            style={{
                width: '100%',
                position: 'relative',
                marginBottom: '30px'
            }}
          >
            <Table
              style={{
                overflow: 'auto',
                width: '100%',
                wordBreak: 'keep-all',
                whiteSpace: 'nowrap',
                fontSize: '5px',
              }} 
              classname='engine-table' 
              dataSource={data} 
              columns={columns} 
              bordered
              pagination={false}
              size='middle'
              loading={isLoading}
            />
            <div style={{marginTop:15, position: 'absolute', right: '0%' }}>
              {showPagination?
                <Pagination 
                size="small" 
                total={total}  
                showQuickJumper
                pageSize={pageSize}
                style={{marginRight: 0}}
                onChange={(page) => changePage(page)}
              /> : null
              }
            </div>
          </div>
        )
    }
}

export default EngineTable;
