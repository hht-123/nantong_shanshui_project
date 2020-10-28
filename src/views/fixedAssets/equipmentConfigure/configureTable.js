import { Table, Pagination, Icon } from 'antd';
import React, { Component } from 'react';


class ConfigureTalbe extends Component{
  
    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage, size } = this.props;

      const columns =  [
        {
          title: '更改时间',
          dataIndex: 'alert_time',
          align: 'center',
          width: 150
        },
        {
          title: '配置人',
          dataIndex: 'equip_person',
          align: 'center',
          width: 120
        },
        {
          title: '主机编号',
          dataIndex: 'engine_code',
          align: 'center',
          width: 120
        },
        {
          title: '主机名称',
          dataIndex: 'engine_name',
          align: 'center',
          width: 120
        },
        {
          title: '设备编号',
          dataIndex: 'equipment_code',
          align: 'center',
          width: 150,
        },
        {
          title: '仓库',
          dataIndex: 'storehouse',
          align: 'center',
          width: 80,
        },
        {
          title: '库位',
          dataIndex: 'storage_location',
          align: 'center',
          width: 80,
        }
      ];

        return (
          <div
            style={{
                width: '70%',
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
                  pageSize={ size }
                  onChange={(page, pageSize) => changePage(page, pageSize)}
                  onShowSizeChange={(current, size) => changeSize(current, size)}
                /> : null
              }
            </div>
          </div>
        )
    }
}

export default ConfigureTalbe;
