import { Table, Pagination, Icon, Popover } from 'antd';
import React, { Component } from 'react';
import './style.less'
import { Link } from 'react-router-dom';


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
          width: 100
        },
        {
          title: '设备编号',
          dataIndex: 'equipment_code',
          align: 'center',
          width: 100
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
            return (
              <div>
                <Popover content="编辑信息" trigger="hover">
                  <Link to={"/app/equipment/edit/" + record.equipment_code } >
                    <Icon type="edit" theme="twoTone"  className="icon"/>
                  </Link>
                </Popover>
                <Popover content="查看该设备传感器信息" trigger="hover">
                  <Icon type="message" theme="twoTone" className="icon" onClick={() => this.props.showSensorModal('sensor',record)}/>
                </Popover>
                <Popover content="填写设备报废单" title="设备报废" trigger="hover">
                  <Icon type="tool" theme="twoTone"  className="icon" />
                </Popover>
                <Popover  content="填写设备报调拨单" title="设备调拨" trigger="hover">
                  <Icon type="home" theme="twoTone"  />
                </Popover>
              </div>
            )
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
