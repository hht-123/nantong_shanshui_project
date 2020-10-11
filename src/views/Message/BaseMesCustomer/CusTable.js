import React, { Component } from 'react';
import { Table, Input, Popconfirm, Form } from 'antd';
import '../style/CusTable.less';


const data = [];

for (let i = 0; i < 100; i++) {
    data.push({
      key: i.toString(),
      client_unit: '',
      client_address:'',
      client_zip_code:'',
      client_industry:'',
      unit_phone:'',
      unit_fax:'',
      note: '',
    });
}

const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <Input />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;

    return (
        <td {...restProps}>
          {editing ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `Please Input ${title}!`,
                  },
                ],
                initialValue: record[dataIndex],
              })(this.getInput())}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }

}

class  EditableTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            data:[], 
            editingKey: '' 
        };
        this.columns = [
          {
            title: '客户单位',
            dataIndex: 'client_unit',
            width: '15%',
            editable: true,
          },
          {
            title: '客户地址',
            dataIndex: 'client_address',
            width: '15%',
            editable: true,
          },
          {
            title: '客户邮编',
            dataIndex: 'client_zip_code',
            width: '10%',
            editable: true,
          },
          {
            title: '客户行业',
            dataIndex: 'client_industry',
            width: '15%',
            editable: true,
          },
          {
            title: '单位电话',
            dataIndex: 'unit_phone',
            width: '10%',
            editable: true,
          },
          {
            title: '单位传真',
            dataIndex: 'unit_fax',
            width: '15%',
            editable: true,
          },
          {
            title: '备注',
            dataIndex: 'note',
            width: '10%',
            editable: true,
          },
          {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
              const { editingKey } = this.state;
              const editable = this.isEditing(record);
              return editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                  编辑
                </a>
              );
            },
          },
        ];
      }
    


    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save (form, key){
    form.validateFields((error, row) => {
        if (error) {
        return;
        }
        const newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ data: newData, editingKey: '' });
        } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
        }
    });
}

edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex ,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });


    return (
        <EditableContext.Provider value={this.props.form}>
            <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
                onChange: this.cancel,
            }}
            />
        </EditableContext.Provider>
        );
    }
}

const  EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;



