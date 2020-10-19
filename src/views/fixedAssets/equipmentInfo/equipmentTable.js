import { Table, Pagination, Icon } from 'antd';
import React, { Component } from 'react';


class EquipmentTable extends Component{
  

    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage } = this.props;

      const columns =  [
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
          width: 120
        },
        {
          title: '仓库',
          dataIndex: 'storehouse',
          align: 'center',
          width: 80
        },
        {
          title: '库位',
          dataIndex: 'storage_location',
          align: 'center',
          width: 80
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
          width: 200,
          render: (text, record, index) => {
            return <Icon type="edit" theme="twoTone" onClick={() => this.props.showEditModal(record)}/>
          }
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
