import { Table, Pagination, } from 'antd';
import React, { Component } from 'react';


class ClientWaterRemindTable extends Component{

  handleStatusColor = (status) => {
    if ( status === '未处理' ) {
      return  { color : 'red '}
    }
  }

    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage, size } = this.props;

      const columns =  [
        {
          title: '提示时间',
          dataIndex: 'notice_time',
          align: 'center',
          width: 160
        },{
          title: '处理时间',
          dataIndex: 'deal_time',
          align: 'center',
          width: 160
        },
        {
          title: '传感器',
          dataIndex: 'type_name',
          align: 'center',
          width: 200
        },
        {
          title: '提示内容',
          dataIndex: 'notice_content',
          align: 'center',
        },
        {
          title: '是否已处理',
          dataIndex: 'deal_status',
          align: 'center',
          width: 180,
          render: text => <div style={this.handleStatusColor(text)}>{text}</div>
        },
      ];

        return (
          <div
            style={{
                width: '120%',
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
              dataSource={ data } 
              columns={ columns } 
              bordered
              pagination={ false }
              size='middle'
              loading={ isLoading }
            />
            <div style={{ marginTop:15, position: 'absolute', right: '0%' }}>
              {showPagination?
                <Pagination 
                  size="small"
                  current={ currentPage } 
                  total={ total }  
                  showQuickJumper
                  pageSize={ size }
                  style={{ marginRight: 0 }}
                  showSizeChanger
                  pageSizeOptions={['10','20','30','40',]}
                  onChange={(page, pageSize) => changePage(page, pageSize)}
                  onShowSizeChange={(current, size) => changeSize(current, size)}
                /> : null
              }
            </div>
          </div>
        )
    }
}

export default ClientWaterRemindTable;