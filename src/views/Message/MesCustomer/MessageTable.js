import { Table, Pagination,  Icon, Button, Popconfirm, Tooltip } from 'antd';
import React, { Component } from 'react';
import '../style/messtable.less';


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
            render:(text, record, index) => {
              return  <Button type="primary" onClick={() => this.props.showContactModal(record.key) } >
                          查看
                      </Button> 
            }
          }
          
        ];

        if (true) {
          columns.push({
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 200,
            render: (text, record, index) => {
              //<icon 图标
              return (
                <div>
                  <Tooltip title="编辑信息">
                    <Icon type="edit" theme="twoTone" className="edit" style={{fontSize:'20px'}} 
                      onClick={() => this.props.showEditModal(record)}
                    />
                  </Tooltip>
                   <Popconfirm
                    title="确定删除该条记录?"
                    onConfirm={() => this.props.deleteInfo(record.key)}
                    okText="是"
                    cancelText="否"
                  >
                    <Tooltip title="删除信息">
                      <Icon type="delete" theme="filled"  style={{ fontSize:'20px', color: 'red', }} 
                        // onClick={() => this.props.deleteInfo(record.key)} 
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>)
            }
          })
        }

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

export default MessageTable;