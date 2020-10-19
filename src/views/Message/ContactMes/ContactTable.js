import React, { Component } from 'react';
import { Table, Icon,  } from 'antd';



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
            dataIndex: 'note',
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
            return (<Icon type="edit" theme="twoTone" onClick={() => this.props.showEditModal(record)}/>)
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




      