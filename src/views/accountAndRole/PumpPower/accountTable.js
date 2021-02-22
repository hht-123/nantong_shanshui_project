import React, { Component } from 'react'
import { Table, Pagination } from 'antd'

class accountTable extends Component{

    render(){
        const { data, isLoading, size, currentPage, total, changePage, rolesObject, rowSelection } = this.props
        const columns = [
            {
                title: '账号',
                dataIndex: 'account',
                align: 'center',
                width:' 25%'
            },
            {
                title: '姓名',
                dataIndex: 'name',
                align: 'center',
                width: '25%'
            },
            {
                title: '角色',
                dataIndex: 'role_name',
                align: 'center',
                width:' 25%',
                render: (text, record, index) => {
                    if (rolesObject) {
                        return rolesObject[record['role_id']]
                    }
                    return ''
                }
            }
        ]

        return(
            <div
                style={{
                    width: '86%',
                    position: 'relative',
                    marginBottom: '30px',
                    marginLeft:'40px'
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
                    rowKey={'aid'}
                    classname='engine-table'
                    dataSource={ data }
                    columns={ columns }
                    bordered
                    pagination={ false }
                    size='middle'
                    loading={ isLoading }
                    rowSelection={rowSelection}
                />

                <div style={{ marginTop:15, position: 'absolute', right: '0%' }}>
                    <Pagination
                        size="small"
                        pageSize={size}
                        current={ currentPage }
                        total={ total }
                        style={{ marginRight: 0 }}
                        onChange={(page) => changePage(page)}
                    />
                </div>
            </div>
        )
    }
}

export default accountTable
