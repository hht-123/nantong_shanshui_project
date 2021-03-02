import React, { Component } from 'react';
import { Table, Pagination, Tooltip, Icon, Popconfirm } from 'antd';

class PumpsTable extends Component {
    cancel = (e) => {
        // console.log("取消")
    }

    handleStatusColor = (string) => {
        if ( string === '已报废' ) {
          return  { color : 'red '}
        }else if(string === '未使用') {
          return  { color : '#DAA520'}
        }
    }

    render(){
        const { total, currentPage, data, changePage, changeSize, isLoading } = this.props;
        const columns = [
            {
                title: '创建时间',
                dataIndex: 'create_time',
                align: 'center',
                width: '10%'
            },
            {
                title: '泵的编号',
                dataIndex: 'pump_code',
                align: 'center',
                width: '5%'
            },
            {
                title: '泵的名称',
                dataIndex: 'pump_name',
                align: 'center',
                width: '15%'
            },
            {
                title: '设备编号',
                dataIndex: 'equipment_code',
                align: 'center',
                width: '10%'
            },
            {
                title: '当前流量',
                dataIndex: 'fluid_flow',
                align: 'center',
                width: '5%'
            },
            {
                title: '修改时间',
                dataIndex: 'mod_time',
                align: 'center',
                width: '10%'
            },
            {
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                width: '10%',
                render: text => <div style={this.handleStatusColor(text)}>{text}</div>
            },
            {
                title: '备注',
                dataIndex: 'note',
                align: 'center',
                width: '15%'
            }]
            if(this.props.roleData.includes("pump_information_management")) {
            columns.push({
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                width:'10%',
                render: (text, record, index) => {
                    const content = []
                    // console.log(55, record)
                    switch(record.status){
                        case '已使用':
                            content.push(
                                <Tooltip  title="编辑信息" trigger="hover" key="编辑信息">
                                    <Icon type="edit" theme="twoTone" style={{ fontSize:'15px' }} onClick={() => this.props.showEditModal(record)}/>
                                </Tooltip>
                            )
                            break;
                        case '未使用':
                            content.push(
                                <Popconfirm  
                                    title="是否确定报废该泵" 
                                    okText="确定"
                                    cancelText="取消"  
                                    onConfirm = {() => this.props.deletePump(record.key)}
                                    onCancel = {this.cancel}
                                    key="删除该泵"
                               >
                                    <Icon type="delete" style={{ fontSize:'15px', color: 'red' }} />
                                </Popconfirm>
                            )
                            break;
                        default:
                            break 
                    }
                    return content
                }
            })
            }

        return(
            <div>
                <Table
                    style={{
                        overflow: 'auto',
                        width: '100%',
                        wordBreak: 'keep-all',
                        whiteSpace: 'nowrap',
                        fontSize: '5px',
                    }}
                    columns={ columns } 
                    bordered
                    size='middle'
                    dataSource={ data }
                    rowKey={(record, index) => index}
                    pagination={false}
                />
                <div style={{ marginTop:15, position: 'absolute', right: '8%' }}>
                    <Pagination 
                        size="small"
                        loading={ isLoading }
                        current={ currentPage } //当前页数
                        total={ total }  
                        showQuickJumper
                        style={{ marginRight: 0 }}
                        showSizeChanger
                        pageSize={this.props.size}
                        pageSizeOptions={['10','20','30','40',]}
                        onChange={(page, pageSize) => changePage(page, pageSize)}
                        onShowSizeChange={(current, size) => changeSize(current, size)}
                    /> 
                </div>
            </div>
        )
    }
}

export default PumpsTable