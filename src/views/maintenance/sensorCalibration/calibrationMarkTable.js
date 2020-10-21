import { Table, Pagination, } from 'antd';
import React, { Component } from 'react';


class CalibrationMarkTable extends Component{

    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage } = this.props;

      const columns =  [
        {
          title: '时间',
          dataIndex: 'notice_time',
          align: 'center',
          width: 160
        },
        {
          title: '传感器',
          dataIndex: 'type_name',
          align: 'center',
          width: 170
        },
        {
          title: '标定理论值',
          dataIndex: 'measurement',
          align: 'center',
          width: 170,
        },
        {
          title: '标定实际值',
          dataIndex: 'maintain_result',
          align: 'center',
        },
        {
          title: '标定补偿值',
          dataIndex: 'calibrate_compensation',
          align: 'center',
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

export default CalibrationMarkTable;