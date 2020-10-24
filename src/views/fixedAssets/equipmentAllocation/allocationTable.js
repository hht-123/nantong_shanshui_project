import { Table, Pagination } from 'antd';
import React, { Component } from 'react';


class AllocationTable extends Component{
  
    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage } = this.props;

      const columns =  [
        {
          title: '调拨时间',
          dataIndex: 'applicant_time',
          align: 'center',
          width: 150
        },
        {
          title: '设备编号',
          dataIndex: 'equipment_code',
          align: 'center',
          width: 120
        },
        {
          title: '设备状态',
          dataIndex: 'status',
          align: 'center',
          width: 80
        },
        {
          title: '调拨人',
          dataIndex: 'applicant',
          align: 'center',
          width: 120
        },
        {
          title: '调入单位',
          dataIndex: 'transfer_unit',
          align: 'center',
          width: 100,
        },
        {
          title: '调入单位电话',
          dataIndex: 'transfer_unit_tel',
          align: 'center',
          width: 100,
        },
        {
          title: '调入单位地址',
          dataIndex: 'transfer_unit_ads',
          align: 'center',
          width: 80,
        },
        {
          title: '调入原因',
          dataIndex: 'allocation_reason',
          align: 'center',
          width: 200,
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

export default AllocationTable;
