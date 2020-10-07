import { Table, Pagination, message, Icon} from 'antd';
import React, { Component } from 'react';
import { Model } from '../../dataModule/testBone';

const model = new Model()

class MessageTable extends Component{
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
        'api/message.json',
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
              data: response.data.results,
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
      //计算一共有多少页面
      const columns =  [
          {
            title: '客户编号',
            dataIndex: 'client_code',
            align: 'center',
            width: 200
          },
          {
            title: '客户单位',
            dataIndex: 'client_unit',
            align: 'center',
            width: 280
          },
          {
            title: '客户地址',
            dataIndex: 'client_address',
            align: 'center',
            width: 280
          },
          {
            title: '客户邮编',
            dataIndex: 'client_zip_code',
            align: 'center',
            width: 150
          },
          {
            title: '客户行业',
            dataIndex: 'client_industry',
            align: 'center',
            width: 150,
          },
          {
            title: '单位电话',
            dataIndex: 'unit_phone',
            align: 'center'
          },
          {
            title: '单位传真',
            dataIndex: 'unit_fax',
            align: 'center'
          },
          {
            title: '联系人',
            dataIndex: 'contact_person',
            align: 'center'
          },

          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 80,
            render: (text) => (
              <Icon type="edit" theme="twoTone" />
            )
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
                onChange={(page) => this.changePage(page)}
              /> : null
              }
            </div>
          </div>
        )
    }
}

export default MessageTable;