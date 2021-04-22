import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import { connect } from 'react-redux'

class Equipment extends Component {
    render() {
        // const handleEngineNmaeDate = this.handleAllEngineName();
        const { getFieldDecorator } = this.props.form;
        const {inputDisabled} = this.props
        const formItemLayout = {
            labelCol: {
              span: 6
            },
            wrapperCol: {
              span: 16,
            },
        };
        
        return (
            <div style={{display: 'flex'}}>
                <div style={{ width: '450px'}}>
                    <Form { ...formItemLayout }>
                        <Form.Item
                            label='设备编号'
                            colon
                        >
                            {getFieldDecorator('equipment_code', {
                                rules: [{ required: true, message: '请输入设备编号' }],
                            })(
                                <Input  name="equipment_code" onChange={this.handleChange} disabled={inputDisabled} />
                            )}
                        
                        </Form.Item>
                        
                        <Form.Item
                            label='主机'
                            colon
                        >
                            {getFieldDecorator('engine_code', {
                                rules: [{ required: true, message: '请选择主机编号' }],
                            })(
                                <Select 
                                    onSelect={(string) => this.handleSelect(string)}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={inputDisabled}
                                >
                                    {/* {
                                        handleEngineNmaeDate.size !== 0? 
                                        handleEngineNmaeDate.map((item, index) => <Option key={index} value={item}>{item}</Option>) 
                                        : null
                                    } */}
                                </Select>
                            )}
                        </Form.Item>
                        
                        <Form.Item
                            label='仓库'
                            colon
                        >
                            {getFieldDecorator('storehouse', {
                                rules: [{ required: true, message: '请输入设备仓库' }],
                            })(
                                <Input  name="storehouse" onChange={this.handleChange} disabled={inputDisabled} />
                            )}
                        </Form.Item>

                        </Form>
                </div>

                <div style={{ width: '450px',marginRight:'60px'}}>
                <Form { ...formItemLayout }>
                    <Form.Item
                        label='库位'
                        colon
                    >
                        {getFieldDecorator('storage_location', {
                            rules: [{ required: true, message: '请输入设备库位' }],
                        })(
                            <Input  name="storage_location" onChange={this.handleChange} disabled={inputDisabled} />
                        )}
                    </Form.Item>

                    <Form.Item
                        label='配置人'
                        colon
                    >
                        {getFieldDecorator('equip_person', {
                            rules: [{ required: true, message: '请指定配置人' }],
                        })(
                            <Input  name="equip_person" onChange={this.handleChange} disabled={inputDisabled} />
                        )}
                    </Form.Item>

                    <Form.Item
                        label='备注'
                        colon
                    >
                    <Input  name="note" onChange={this.handleChange}  disabled={inputDisabled} />
                    </Form.Item>
                </Form>
                </div>
         </div>
        )
    }
}

const mapStateToProps = (state) => ({
    inputDisabled: state.getIn(['equipmentProcess', 'inputDisabled']),
})

export default connect(mapStateToProps, null)(Form.create()(Equipment));
