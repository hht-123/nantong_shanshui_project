import { Table, Pagination,  Icon,Button } from 'antd';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';


class MessageTable extends Component{
    render() {
      const { isLoading, data, total, showPagination, changePage, changeSize, currentPage } = this.props;
      const columns =  [
          {
            title: '客户编号',
            dataIndex: 'client_code',
            align: 'center',
            width: 150
          },
          {
            title: '客户单位',
            dataIndex: 'client_unit',
            align: 'center',
            width: 150
          },
          {
            title: '客户地址',
            dataIndex: 'client_address',
            align: 'center',
            width: 150
          },
          {
            title: '客户邮编',
            dataIndex: 'client_zip_code',
            align: 'center',
            width: 150
          },
          {
            title: '客户行业',
            dataIndex: 'client_industry',
            align: 'center',
            width: 150,
          },
          {
            title: '单位电话',
            dataIndex: 'unit_phone',
            align: 'center'
          },
          {
            title: '单位传真',
            dataIndex: 'unit_fax',
            align: 'center'
          },
          {
            title: '联系人',
            dataIndex: 'contact_person',
            align: 'center',
            render:() => {
              return <Button type="primary"><Link to="/app/contact">查看</Link></Button>
            }
          },

          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 80,
            render: (text, record, index) => {
              //<icon 图标
              return (<Icon type="edit" theme="twoTone" onClick={() => this.props.showEditModal(record)}/>)
            }
          }
        ];

        return (
          <div 
            style={{
                width: '100%',
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
              classname='message-table' 
              dataSource={data} 
              columns={columns} 
              bordered
              pagination={false}
              size='middle'
              loading={isLoading}
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

export default MessageTable;