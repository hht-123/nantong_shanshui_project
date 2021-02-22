import React, { Component } from 'react'
import { Table, Pagination, Tooltip, Icon} from 'antd'


class PumpPowerTable extends Component {
    render(){
        const { currentPage, data, changePage, changeSize, isLoading, size, total } = this.props
        const columns = [
            {
                title: '创建时间',
                dataIndex: 'create_time',
                align: 'center',
                width: '15%'
            },
            {
                title: '泵的编号',
                dataIndex: 'pump_code',
                align: 'center',
                width:'15%'
            },
            {
                title: '泵的名称',
                dataIndex: 'pump_name',
                align: 'center',
                width: '20%'
            },
            {
                title: '泵的当前流量',
                dataIndex: 'fluid_flow',
                align: 'center',
                width: '15%'
            },
            {
                title: '设备编号',
                dataIndex: 'equipment_code',
                align: 'center',
                width: '20%'
            }
        ];
        columns.push({
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: '15%',
            render:  (text, record, index) => {
                const content = []
                content.push(
                    <Tooltip  title="查看该泵对应用户" trigger="hover" key="查看该泵对应用户">
                        <Icon 
                            type="profile" 
                            theme="twoTone" 
                            style={{ fontSize:'15px' }}
                            onClick={() => this.props.showPowerModal(record)}
                        />
                    </Tooltip>
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
                />
                <div style={{ marginTop:20, position: 'absolute', right: '20%' }}>
                    <Pagination 
                        size="small"
                        loading={ isLoading }
                        current={ currentPage } //当前页数
                        total = { total }  
                        showQuickJumper
                        style={{ marginRight: 0 }}
                        showSizeChanger
                        pageSize={size}
                        pageSizeOptions={['10','20','30','40',]}
                        onChange={(page, pageSize) => changePage(page, pageSize)}
                        onShowSizeChange={(current, size) => changeSize(current, size)}
                    /> 
                </div>
            </div>
        )
    }
}

export default PumpPowerTable
