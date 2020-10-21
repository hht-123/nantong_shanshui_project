import React, { Component } from "react";
import {Button, Input, Select} from "antd";

import { originalUrl, role, user, power } from '../../../dataModule/UrlList'
import { Model } from '../../../dataModule/testBone'
import AccountTable from './accountTable'
import EditPower from './editPower'
import AddAccount from './addAccount'
import BasicInformation from './basicInformation'
import DeleteAccount from './deleteAccount'

import './style.less'

const model = new Model();
const { Option } = Select;

export default class AccountManagement extends Component{
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      role_id: '',
      roles: [],
      rolesObject: null,
      accounts: [],
      accountsIsLoading: true,
      total: 0,
      size: 10,
      currentPage: 1,

      editPowerVisible: false,
      addAccountVisible: false,
      basicInfoVisible: false,
      delAccountVisible: false,

      record: {}
    }
  }

  componentDidMount() {
    const me = this
    model.fetch(
      {},
      originalUrl + role,
      'get',
      function (res) {
        const data = res.data
        me.setState({
          roles: data
        })
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
    this.getUsers()
    this.queryOfPower()
  }

  resetSearch = () => {
    this.setState({
      account: '',
      role_id: ''
    })
    this.getUsers(1, this.state.size, true)
  }

  queryOfPower = (params={}, methods='get') => {
    model.fetch(
      {
        currentPage: 1,
        size: 10,
        ...params
      },
      originalUrl + power,
      methods,
      function (res) {
        console.log('queryOfPower', res)
      }
    )
  }

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
      originalUrl + user,
      'get',
      function (res) {
        me.setState({
          accounts: res.data.results,
          accountsIsLoading: false,
          total: res.data.count,
          currentPage: currentPage
        })
      }
    )
  }

  handleChange = (key, value) => {
    const rawState = this.state
    rawState[key] = value
    this.setState(rawState)
  }

  changePage = (page) => {
    this.setState({
      accountsIsLoading: true
    })
    this.getUsers(page)
  }

  handleOk = (type) => {
    const newData = {}
    newData[type] = false
    this.setState(newData)
  }

  handleCancel = (type) => {
    const newData = {}
    newData[type] = false
    this.setState(newData)
  }

  showEditModal = (record, type) => {
    const newData = {}
    newData[type] = true
    newData['record'] = record
    this.setState(newData)
  }

  render() {
    const {
      account,
      roles,
      accounts,
      accountsIsLoading,
      rolesObject,
      total,
      size,
      currentPage,
      role_id,
      editPowerVisible,
      addAccountVisible,
      basicInfoVisible,
      delAccountVisible,
      record
    } = this.state
    return(
      <div className="account-root">
        <div className='name'>账户管理：</div>
        <div className='wrapper'>
          <div className='func'>
            <div style={{ float: 'left' }}>
              <div className="input" >账户:</div>
              <Input
                allowClear
                style={{ width: "300px" }}
                name="search_engine_code"
                onChange={e => this.handleChange('account', e.target.value) }
                value={ account }
              />
            </div>
            <div className="inputWrapper" >
              <div className="input" >角色:</div>
              <Select value={role_id} style={{ width: 300 }} onChange={(e) => this.handleChange('role_id', e)} allowClear>
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
            </div>
            <div className="line" />
            <div style={{marginTop: "15px"}}>
              <Button className="button" onClick={() => this.getUsers()}>搜索</Button>
              <Button className="button" onClick={this.resetSearch}>重置</Button>
              <Button type="primary" className="button" onClick={() => this.setState({addAccountVisible: true})}>新增账户</Button>
            </div>
          </div>

          <div className='engineTableWrapper'>
            <AccountTable
              data={ accounts }
              isLoading={ accountsIsLoading }
              showPagination={ false }
              size={ size }
              total={ total }
              showEditModal={ this.showEditModal }
              rolesObject={rolesObject}
              currentPage={currentPage}
              changePage={this.changePage}
            />
          </div>

          <EditPower
            visible={editPowerVisible}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
          />

          <AddAccount
            visible={addAccountVisible}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            getUsers={this.getUsers}
            roles={roles}
          />

          <BasicInformation
            visible={basicInfoVisible}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            getUsers={this.getUsers}
            record={record}
            roles={roles}
            rolesObject={rolesObject}
          />

          <DeleteAccount
            visible={delAccountVisible}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            record={record}
            getUsers={this.getUsers}
          />
        </div>
      </div>
    )
  }
}
