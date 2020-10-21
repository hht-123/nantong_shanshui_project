import React, { Component } from "react";
import {Input, message, Modal, Select} from "antd";
import {getUserId, getUserName} from "../../../publicFunction";
import {originalUrl, user} from "../../../dataModule/UrlList";
import {Model} from "../../../dataModule/testBone";

const { Option } = Select
const model = new Model()

export default class BasicInformation extends Component{
  constructor(prop) {
    super(prop)
    this.state = {
      name: '',
      password: '',
      role_id: undefined,
      telephone_num: '',
      power_num_str: ''
    }
  }

  handleChange = (key, value) => {
    const rawState = this.state
    rawState[key] = value
    this.setState(rawState)
  }

  createAccount = () => {
    const me = this
    const newAccount = this.state
    for (let i in newAccount) {
      if (newAccount[i] === '' || newAccount[i] === undefined) {
        if (i !== 'power_num_str') {
          message.error('信息未填写完整！')
          return
        }
      }
    }
    newAccount['add_by'] = getUserId()
    model.fetch(
      newAccount,
      originalUrl + user,
      'put',
      function (res) {
        message.success('编辑账户成功！')
        me.props.getUsers()
      },
      function (error) {
        message.error('编辑账户失败！')
      }
    )
    this.props.handleOk('basicInfoVisible')
  }

  initState = () => {
    const initData = {}
    const newAccount = this.state
    for (let i in newAccount) {
      initData[i] = ''
    }
    initData['role_id'] = undefined
    this.setState(initData)
    this.props.handleCancel('basicInfoVisible')
  }

  render() {
    const {
      visible,
      roles,
      record,
      rolesObject
    } = this.props

    const {
      name,
      password,
      role_id,
      telephone_num
    } = this.state

    return (
      <Modal
        title="编辑基础信息"
        visible={visible}
        onOk={() => this.createAccount()}
        onCancel={() => this.initState()}
      >
        <div className={"inputItem"}>
          <span>姓名：</span>
          <Input placeholder={record.name} allowClear style={{ width: "200px" }} value={name} onChange={e => this.handleChange('name', e.target.value)}/>
        </div>
        <div className={"inputItem"}>
          <span>密码：</span>
          <Input placeholder={record.password} allowClear style={{ width: "200px" }} value={password} onChange={e => this.handleChange('password', e.target.value)}/>
        </div>
        <div className={"inputItem"}>
          <span>角色：</span>
          <Select placeholder={rolesObject === null ? undefined : rolesObject[record.role_id]}  value={role_id} style={{ width: 200 }} onChange={(e) => this.handleChange('role_id', e)} allowClear>
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
        <div className={"inputItem"}>
          <span>联系方式：</span>
          <Input placeholder={record.telephone_num} allowClear style={{ width: "200px" }} value={telephone_num} onChange={e => this.handleChange('telephone_num', e.target.value)}/>
        </div>
      </Modal>
    )
  }
}
