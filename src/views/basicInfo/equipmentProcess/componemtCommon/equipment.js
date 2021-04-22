import React, { Component } from 'react';
import { Form, Input, Select, message } from 'antd';
import { connect } from 'react-redux'
import { Model } from "../../../../dataModule/testBone";
import { allEngineName } from '../../../../dataModule/UrlList';

const model = new Model();
const { Option } = Select;

class Equipment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            equipment_code: '',   //设备编号
            engine_code:  '',     //主机编号
            storehouse: '',       //设备仓库
            storage_location: '', //设备库位
            equip_person: '',     //配置人
            note: '',              //备注
            allEngineName: [],    //获取所有的主机编号
        }
    }
    componentDidMount() {
        this.getEngineName({engineNmae: 'all'});
    }

    
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }

    //获取所有主机名称和编号
    getEngineName = (params) => {
        let me = this;
        model.fetch(
          params,
          allEngineName,
          'get',
            function (response) {
              me.setState({
                allEngineName: response.data
              })
          },
          function() {
            message.warning('加载失败，请重试')
            return false;
          },
          false
        )
    }
    

     //主机编号和姓名处理
     handleAllEngineName = () => {
        const { allEngineName } = this.state;
        const handledata = allEngineName.map((item) => (
            item.engine_name + '/' + item.engine_code
        ))
        return handledata;
    }

    //处理数据获取 返回主机编号
    //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置 
    //substr(start,length) 方法可在字符串中抽取从 start 下标开始的指定数目的字符
    handleSelect = (string) => {
        let engine_code = string;
        const index = engine_code.indexOf('/');
        engine_code = engine_code.substr(index+1);
        this.setState({engine_code});
    }


    render() {
        const handleEngineNmaeDate = this.handleAllEngineName();
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
                                    {
                                        handleEngineNmaeDate.size !== 0? 
                                        handleEngineNmaeDate.map((item, index) => <Option key={index} value={item}>{item}</Option>) 
                                        : null
                                    }
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
