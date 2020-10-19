import { Table, Icon  } from 'antd';
import React, { Component } from 'react';


class CalibrationTable extends Component{

    render() {
      const { isLoading, data, } = this.props;

      const columns =  [
        {
          title: '传感器',
          dataIndex: 'type_name',
          align: 'center',
          width: 170
        },
        {
          title: '标定理论值',
          dataIndex: 'theoretical_value',
          align: 'center',
          width: 170
        },
        {
          title: '标定实际值',
          dataIndex: 'actual_value',
          align: 'center',
          width: 170,
        },
        {
          title: '标定补偿值',
          dataIndex: 'calibrate_compensation',
          align: 'center',
          width: 170,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          render: (text, record, index) => {
            return <Icon type="edit" theme="twoTone" onClick={() => this.props.showEditModal(record)}/>
          }
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
          </div>
        )
    }
}

export default CalibrationTable;