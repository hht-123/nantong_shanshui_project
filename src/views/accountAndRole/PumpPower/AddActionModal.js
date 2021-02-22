import { Modal, Select, Input, Button} from 'antd'
import React, { Component } from 'react'

import './style.less'
import AccountTable from './accountTable'

import { Model } from '../../../dataModule/testBone'
import { user, role } from '../../../dataModule/UrlList'

const model = new Model()
const { Option } = Select;
class AddActionModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            accounts: [],    //客户信息
            size: 10,
            currentPage: 1,
            account: '',
            role_id:'',
            accountsIsLoading: false,
            total: 0,
            roles: [],        //存储角色信息
            rolesObject: {},    //把角色aid与名称一一对应
            selectedRowKeys: []     //存储添加操作者的user_id
        }
    }

    //拿到角色信息 把角色aid与名称一一对应
    componentDidMount(){
        const me = this
        model.fetch(
          {},
          role,
          'get',
          function (res) {
            const data = res.data
            me.setState({
              roles: data
            })
            // console.log('roles',me.state.roles)
            const rolesObject = {}
            for (let i = 0; i < data.length; i++) {
              rolesObject[data[i]['aid']] = data[i]['role_name']
            }
            me.setState({
              rolesObject: rolesObject
            })
          },
          null,
          false
        )
        this.getUsers();
    }

    //获取所有用户信息
    getUsers = (currentPage=1, size=this.state.size, whetherReset) => {
        let { account, role_id } = this.state
        const me = this
        if (whetherReset) {
          account = ''
          role_id = ''
        }
        model.fetch(
          {
            account,
            role_id,
            currentPage,
            size
          },
          user,
          'get',
          function (res) {
            // console.log(556, res.data.results)
            me.setState({
              accounts: res.data.results,
              accountsIsLoading: false,
              total: res.data.count,
              currentPage: currentPage
            })
          }
        )
    }

    //重置功能
    resetSearch = () => {
        this.setState({
          account: '',
          role_id: ''
        })
        this.getUsers(1, this.state.size, true)
    }

    //把角色装换成role_id
    handleChange = (key, value) => {
        const rawState = this.state
        rawState[key] = value
        this.setState(rawState)
    }

    //换页获取内容
    changePage = (page) => {
        this.setState({
          accountsIsLoading: true
        })
        this.getUsers(page)
    }

    clearCheck = () => { // 处理勾选数据后清空勾选
        this.setState({
            selectedRowKeys: []
        })
    }


    //添加泵的操作者
    handleOk = () => {
        const { selectedRowKeys } = this.state
        let params = selectedRowKeys[0]
        this.props.addPumpAction(params)
        this.clearCheck()
    }

    //关闭弹窗
    handleCancel = () => {
        this.props.closeModal()
    }

    
    render(){
        const {
            accounts,
            accountsIsLoading,
            size,
            total,
            roles,
            role_id,
            account,
            currentPage,
            rolesObject,
            selectedRowKeys
        } = this.state

        const { addModalVisible } = this.props

        const rowSelection = {
            selectedRowKeys, //这里是起作用的关键
            onChange: (selectedRowKeys) => {
                this.setState({
                    selectedRowKeys
                })
            }
        }

        return(
            <div>
                <Modal
                    title="添加泵的操作者"
                    visible={ addModalVisible }
                    onCancel = { this.handleCancel }
                    width='1000px'
                    onOk={this.handleOk}
                >
                    <div className="addActionSearch">
                        <div style={{fontSize:'20px'}}>账号：</div>
                        <Input
                            style={{width:'200px',marginLeft:'20px'}}
                            allowClear
                            name="search_engine_code"
                            onChange={e => this.handleChange('account', e.target.value) }
                            value={ account }
                        />
                        <div style={{fontSize:'20px',marginLeft:'40px'}}>角色：</div>
                        <Select
                            vaSelectlue={role_id}  
                            onChange={(e) => this.handleChange('role_id', e)}
                            allowClear
                            style={{width:'200px',marginLeft:'20px'}}
                        >
                            {
                                roles.map((item, index) => {
                                return <Option
                                    value={item.aid}
                                    key={index}
                                    onClick={() => {this.setState({role_id: item.aid})}}
                                >{item.role_name}</Option>
                                })
                            }
                        </Select>
                        <Button 
                            type="primary"
                            style={{marginLeft:'60px'}}
                            onClick={() => this.getUsers()}
                        >搜索</Button>
                        <Button
                            style={{marginLeft:'20px'}}
                            onClick={this.resetSearch}
                        >重置</Button>
                    </div>
                    <div>
                        <AccountTable
                            data={ accounts }
                            isLoading={ accountsIsLoading }
                            showPagination={ false }
                            size={ size }
                            total={ total }
                            currentPage={currentPage}
                            changePage={this.changePage}
                            rolesObject={rolesObject}
                            onChange={this.onChange}
                            rowSelection = {rowSelection}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default AddActionModal
