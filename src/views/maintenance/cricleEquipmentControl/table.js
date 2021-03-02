import React, { Component } from 'react';
import { Modal, Table, Icon, Popconfirm, Tooltip } from 'antd';

class AutoOperationTable extends Component{

    constructor(props) {
        super (props);
        this.state = {
            confirmLoading: false,
        }
    }

    handleCancel = () => {
        this.props.close()
    }

    render() {
        const { visible, } = this.props;
        const { isLoading, data,  } = this.props;
        const { confirmLoading } = this.state;

        const columns =  [
            {
              title: '开始时间',
              dataIndex: 'begin_time',
              align: 'center',
              width: 150
            },
            {
              title: '结束时间',
              dataIndex: 'end_time',
              align: 'center',
              width: 150
            },
            {
              title: '剂量',
              dataIndex: 'dosage',
              align: 'center',
              width: 150,
            },
            {
              title: '时间间隔',
              dataIndex: 'period',
              align: 'center',
              width: 150,
            },
            {
              title: '类型',
              dataIndex: 'operation_type',
              align: 'center',
              width: 100,
            },
            {
              title: '操作',
              dataIndex: 'operation',
              align: 'center',
              width: 100,
              render: (text, record, index) => {
                //<icon 图标
                return (
                <div>
                  <Popconfirm
                        title="确定删除该任务?"
                        onConfirm={() => this.props.delete(record.key, record.pump_code)}
                        okText="是"
                        cancelText="否"
                  >
                    <Tooltip title="删除任务">
                      <Icon type="delete" theme="filled"  style={{ fontSize:'20px', color:'red', }} 
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
                )
              }
            },
          ]

        return (
            <div>
                <Modal
                title="该泵的未完成任务"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onCancel={ this.handleCancel }
                footer={null}
                width='85%'
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
                </Modal>
            </div>
        )
    }
}

export default AutoOperationTable
