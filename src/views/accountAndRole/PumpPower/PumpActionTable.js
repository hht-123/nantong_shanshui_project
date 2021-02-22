import React, { Component } from 'react'
import { Table, Popconfirm, Icon } from 'antd'

class PumpActionTable extends Component {

    cancel = () => {
        console.log('取消')
    }

    render(){
        const { data } = this.props
        const columns = [
            {
                title: '账号',
                dataIndex: 'account',
                align: 'center',
                width: '25%'
            },
            {
                title: '姓名',
                dataIndex: 'user_name',
                align: 'center',
                width: '25%'
            },
            {
                title: '角色',
                dataIndex: 'role_name',
                align: 'center',
                width:'25%'
            },
        ]
        columns.push({
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: '25%',
            render:  (text, record, index) => {
                const content = []
                content.push(
                    <Popconfirm  
                        title="是否解除该用户权限"
                        onConfirm = { () => this.props.deleteAction(record)}
                        onCancel={ this.cancel }
                        okText="确定"
                        cancelText="取消"
                        key = "是否解除该用户权限"
                    >
                        <Icon 
                            type="delete" 
                            theme="twoTone" 
                            style={{ fontSize:'15px', color: 'red' }}
                        />
                    </Popconfirm>
                )
                return content
            }
        })

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
                    rowKey={ data.key }
                    pagination={false}
                ></Table>
            </div>
        )
    }
}

export default PumpActionTable
