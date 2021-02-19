import { Table, Pagination, } from 'antd';
import React, { Component } from 'react';


class OperationRecordTable extends Component{

    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage, size } = this.props;

      const columns =  [
        {
          title: '操作时间',
          dataIndex: 'operation_time',
          align: 'center',
          width: 200
        },
        {
          title: '泵的编号',
          dataIndex: 'pump_code',
          align: 'center',
          width: 150
        },
        {
          title: '泵的名称',
          dataIndex: 'pump_name',
          align: 'center',
          width: 150,
        },
        {
          title: '开泵时间',
          dataIndex: 'open_time',
          align: 'center',
          width: 150,
        },
        {
          title: '操作人',
          dataIndex: 'user_name',
          align: 'center',
          width: 150,
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
                  style={{ marginRight: 0 }}
                  pageSize={ size }
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

export default OperationRecordTable;