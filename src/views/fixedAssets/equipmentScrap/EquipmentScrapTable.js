import React,{ Component } from 'react';
import { Table, Pagination } from 'antd';


class EquipmentTable extends Component {
  render() {
    const { isLoading, data, total, showPagination, changePage, changeSize, currentPage } = this.props;

    const columns =  [
      {
        title: '申请时间',
        dataIndex: 'applicant_time',
        align: 'center',
        width: 150
      },
      {
        title: '主机编号',
        dataIndex: 'host_number',
        align: 'center',
        width: 120
      },
      {
        title: '主机名称',
        dataIndex: 'host_name',
        align: 'center',
        width: 80
      },
      {
        title: '设备编号',
        dataIndex: 'equipment_code',
        align: 'center',
        width: 120
      },
      {
        title: '报废原因',
        dataIndex: 'scrapping_reasons',
        align: 'center',
        width: 100,
      },
      {
        title: '仓库',
        dataIndex: 'store',
        align: 'center',
        width: 100,
      },
      {
        title: '库位',
        dataIndex: 'location',
        align: 'center',
        width: 80,
      },
    ];

      return (
        <div 
          style={{
              width: '90%',
              position: 'relative',
              marginBottom: '30px',
          }}
        >
          <Table
            style={{
              overflow: 'auto',
              width: '100%',
              wordBreak: 'keep-all',
              whiteSpace: 'nowrap',
            }} 
            classname='badsensor-table' 
            dataSource={data} 
            columns={columns} 
            bordered
            pagination={false}
            size='middle'
            loading={isLoading}
          />
          <div style={{ marginTop:15, position: 'absolute', right: '0%' }}>
            {showPagination?         //分页
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
 


export default EquipmentTable;