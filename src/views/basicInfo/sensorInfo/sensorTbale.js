import { Table, Pagination, Icon } from 'antd';
import React, { Component } from 'react';


class SensorTable extends Component{

    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage } = this.props;

      const columns =  [
        {
          title: '传感器编号',
          dataIndex: 'sensor_code',
          align: 'center',
          width: 120,
        },
        {
          title: '传感器类型',
          dataIndex: 'type_name',
          align: 'center',
          width: 150
        },
        {
          title: '传感器型号',
          dataIndex: 'sensor_model',
          align: 'center',
          width: 150
        },
        {
          title: '标定理论值',
          dataIndex: 'theoretical_value',
          align: 'center',
          width: 100
        },
        {
          title: '默认补偿值',
          dataIndex: 'default_compensation',
          align: 'center',
          width: 100
        },
        {
          title: '传感器阈值',
          dataIndex: 'sensor_threshold',
          align: 'center',
          width: 100
        },
        {
          title: '提示内容',
          dataIndex: 'notice_content',
          align: 'center',
          width: 150
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
          width: 80,
          render: (text, record, index) => {
            return <Icon type="edit" theme="twoTone" onClick={() => this.props.showEditModal(record)}/>
          }
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

export default SensorTable;