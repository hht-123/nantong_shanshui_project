import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );


const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };
  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends Component {
    constructor(props) {
      super(props);
      this.columns = [
        {
          title: '联系人',
          dataIndex: 'contact_person',
          width: '20%',
          editable: true,
        },
        {
          title: '联系人职位',
          dataIndex: 'contact_position',
          width: '20%',
          editable: true,
        },
        {
          title: '联系人电话',
          dataIndex: 'contact_tel',
          width: '20%',
          editable: true,
        },
        {
            title: '备注',
            dataIndex: 'note',
            width: '20%',
          editable: true,
          },
        {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <a>删除</a>
              </Popconfirm>
            ) : null,
        },
      ];

      this.state = {
        dataSource: [
          {
            key: '0',
            contact_person: '',
            contact_position: '',
            contact_tel:'',
            note: '',
          },
          {
            key: '1',
            contact_person: '',
            contact_position: '',
            contact_tel:'',
            note: '',
          },
        ],
        count: 2,
      };
    }

        handleDelete = key => {
            const dataSource = [...this.state.dataSource];
            this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        };

        handleAdd = () => {
            const { count, dataSource } = this.state;
            const newData = {
            key: count,
            contact_person: '',
            contact_position: '',
            contact_tel:'',
            note: '',
            };
            this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
            });
        };

        handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
        };

      render() {
        const { dataSource } = this.state;
        const components = {
          body: {
            row: EditableFormRow,
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
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSave,
              }),
            };
        });

        return (
        <div>
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                添加联系人
            </Button>
            <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            />
        </div>
        );
    }
}


export default EditableTable;




      