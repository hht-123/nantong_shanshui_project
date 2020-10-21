import React, { Component } from 'react';
import { Table, Icon,  } from 'antd';
import '../style/messtable.less';


class EditableTable extends Component {
  render(){
    const { isLoading, data } = this.props;
      const columns = [
        {
          title: '联系人  ',
          dataIndex: 'contact_person',
          align: 'center',
          width: '100px',
        },
        {
          title: '联系人职位',
          dataIndex: 'contact_position',
          align: 'center',
          width: '100px',
        },
        {
          title: '联系人电话',
          dataIndex: 'contact_tel',
          align: 'center',
          width: '100px',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            align: 'center',
            width: '100px',
          },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '100px',
          render: (text, record, index) => {
            //<icon 图标
            return (
            <div>
              <Icon type="edit" className="edit"  theme="twoTone" style={{fontSize:'20px' }} onClick={() => this.props.showEditModal(record)}/>
              <Icon type="delete" theme="twoTone"  style={{fontSize:'20px' }} onClick={() => this.props.deleteInfo(record.key)} />
            </div>
            )
          }
        },
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
            classname='contact-table' 
            dataSource={data} 
            columns = {columns}
            bordered
            size='middle'
            loading={isLoading}
          />
        </div>
      )

    }    
}

export default EditableTable;




      