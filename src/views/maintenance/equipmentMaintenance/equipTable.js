import { Table, Pagination, Icon, Tooltip } from 'antd';
import React, { Component } from 'react';


class EquipMaintenanceTable extends Component{
    handleStatusColor = (numb) => {
      if ( numb === '等待维护' ) {
        return  { color : 'red '}
      }else if ( numb === '维护未结束' ) {
        return  { color : 'red '}
      }
    }

    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage, size } = this.props;

      const columns =  [
        {
          title: '登记时间',
          dataIndex: 'repair_time',
          align: 'center',
          width: 120
        },
        {
          title: '维护时间',
          dataIndex: 'maintain_time',
          align: 'center',
          width: 120
        },
        {
          title: '维护原因',
          dataIndex: 'maintain_cause',
          align: 'center',
          width: 120
        },
        {
          title: '设备状况描述',
          dataIndex: 'fault_description',
          align: 'center',
        },
        {
          title: '维护结果',
          dataIndex: 'maintain_result',
          align: 'center',
          width: 120,
          render: text => <div style={this.handleStatusColor(text)}>{text}</div>
        },
        {
          title: '维护状态',
          dataIndex: 'maintain_status',
          align: 'center',
          width: 120,
          render: text => <div style={this.handleStatusColor(text)}>{text}</div>
        },
        {
            title: '负责人',
            dataIndex: 'responsible_person',
            align: 'center',
            width: 120
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 80,
          render: (text, record, index) => {
            return <div>
                      <Tooltip title="编辑信息">
                        <Icon type="edit" theme="twoTone" 
                            onClick={() => this.props.showEditModal(record)}
                        />
                      </Tooltip>
                    </div>
          }
        }
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

export default EquipMaintenanceTable;