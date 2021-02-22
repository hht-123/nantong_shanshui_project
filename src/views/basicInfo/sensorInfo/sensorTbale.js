import { Table, Pagination, Icon, Tooltip } from 'antd';
import React, { Component } from 'react';


class SensorTable extends Component{

  handleStatusColor = (string) => {
    if ( string === '报废' ) {
      return  { color : 'red '}
    }else if( string === '未使用'){
      return  { color : '#DAA520'}
    }
  }

    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage } = this.props;

      const columns =  [
        {
          title: '传感器编号',
          dataIndex: 'sensor_code',
          align: 'center',
          width: '10%',
        },
        {
          title: '传感器类型',
          dataIndex: 'type_name',
          align: 'center',
          width: '10%'
        },
        {
          title: '传感器型号',
          dataIndex: 'sensor_model',
          align: 'center',
          width: '10%'
        },
        {
          title: '标定理论值',
          dataIndex: 'theoretical_value',
          align: 'center',
          width: '10%'
        },
        {
          title: '默认补偿值',
          dataIndex: 'default_compensation',
          align: 'center',
          width: '10%'
        },
        {
          title: '传感器上阈值',
          dataIndex: 'high_sensor_threshold',
          align: 'center',
          width: '10%'
        },
        {
          title: '传感器下阈值',
          dataIndex: 'down_sensor_threshold',
          align: 'center',
          width: '10%'
        },
        {
          title: '提示内容',
          dataIndex: 'notice_content',
          align: 'center',
          width: '15%'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '5%',
          render: text => <div style={this.handleStatusColor(text)}>{text}</div>
        },
        {
          title: '备注',
          dataIndex: 'note',
          align: 'center',
          width: '5%'
        },
      ];

      if(this.props.roleData.includes("sensor_manage")) {
        columns.push({
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: '5%',
          render: (text, record, index) => (
            <Tooltip  title="编辑信息" trigger="hover" >
              <Icon type="edit" theme="twoTone" onClick={() => this.props.showEditModal(record)}/>
            </Tooltip>
          )
        }
        )
      }

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
                  pageSize={ this.props.size }
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
