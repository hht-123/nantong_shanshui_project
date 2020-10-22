import { Table, Pagination, } from 'antd';
import React, { Component } from 'react';


class WaterRemindInfo extends Component{

    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage } = this.props;

      const columns =  [
        {
          title: '时间',
          dataIndex: 'notice_time',
          align: 'center',
          width: 200
        },
        {
          title: '传感器名称',
          dataIndex: 'type_name',
          align: 'center',
          width: 200
        },
        {
          title: '测量值',
          dataIndex: 'measurement',
          align: 'center',
          width: 150,
        },
        {
          title: '提示内容',
          dataIndex: 'notice_content',
          align: 'center',
          width: 250,
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

export default WaterRemindInfo;