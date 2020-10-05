import { Table, Pagination } from 'antd';
import React, { Component } from 'react';
import '../style/table.less'

class AntdTbale2 extends Component{

    render() {
      const {total, pageSize, showPagination, isLoading, data, columns} = this.props;
        return (
          <div
            style={{
                width: 800,
                position: 'relative',
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
              dataSource={data} 
              columns={columns} 
              bordered
              pagination={false}
              size='middle'
              loading={isLoading}
            />
            <div style={{marginTop:15, position: 'absolute', right: '0%' }}>
              {showPagination?
                <Pagination 
                size="small" 
                total={total}
                showQuickJumper
                pageSize={pageSize}
                style={{marginRight: 0}}
                onChange={(page) => this.props.changePage(page)}
              /> : null
              }
            </div>
          </div>
        )
    }
}

export default AntdTbale2;

// const data = [
//   {
//     key: "1",
//     engine_code: "20170606",
//     engine_name: "水管家一代",
//     begin_time: "2017-06-06",
//     end_time: "2019-02-06",
//     status: "停产",
//     note: ""
//   },
//   {
//     key: "2",
//     engine_code: "20171209",
//     engine_name: "水管家一代",
//     begin_time: "2017-02-09",
//     end_time: "",
//     status: "在产",
//     note: ""
//   },
//   {
//     key: "3",
//     engine_code: "20180606",
//     engine_name: "水管家三代",
//     begin_time: "2018-06-06",
//     status: "在产",
//     note: ""
//   },
//   {
//     key: "4",
//     engine_code: "20170606",
//     engine_name: "水管家一代",
//     begin_time: "2017-06-06",
//     end_time: "2019-02-06",
//     status: "停产",
//     note: ""
//   },
//   {
//     key: "5",
//     engine_code: "20171209",
//     engine_name: "水管家一代",
//     begin_time: "2017-02-09",
//     end_time: "",
//     status: "在产",
//     note: ""
//   }
// ]

// const columns =  [
//   {
//     title: '主机编号',
//     dataIndex: 'engine_code',
//     align: 'center',
//     width: 100
//   },
//   {
//     title: '主机名称',
//     dataIndex: 'engine_name',
//     align: 'center',
//     width: 120
//   },
//   {
//     title: '开始生产时间',
//     dataIndex: 'begin_time',
//     align: 'center',
//     width: 120
//   },
//   {
//     title: '结束生产时间',
//     dataIndex: 'end_time',
//     align: 'center',
//     width: 120
//   },
//   {
//     title: '状态',
//     dataIndex: 'status',
//     align: 'center',
//     width: 80,
//   },
//   {
//     title: '备注',
//     dataIndex: 'note',
//     align: 'center'
//   },
//   {
//     title: '操作',
//     dataIndex: 'action',
//     align: 'center',
//     width: 80
//   }
// ];