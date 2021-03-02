import React, { Component } from "react";
import {Input, message, Modal, Select} from "antd";

import { Model } from '../../../dataModule/testBone'
import {
  // getUserId,
   getUserName} from "../../../publicFunction"
import {originalUrl, user} from "../../../dataModule/UrlList";

const { Option } = Select
const model = new Model()

export default class AddAccount extends Component {
  constructor(prop) {
    super(prop)
    this.state = {
      name: '',
      password: '',
      role_id: undefined,
      telephone_num: '',
      power_id_str: '1',
      alter_power: '1',
      client_id:'',
      add_by: getUserName(),
    }
  }

  handleChange = (key, value) => {
    const rawState = this.state
    rawState[key] = value
    // console.log(rawState)
    this.setState(rawState)
    if(rawState['role_id'] === "9ca9088b74694db5a1b4594bcb8b2912") {
      document.getElementById('client_unit').style.display = "block"
    } else {
      document.getElementById('client_unit').style.display = 'none'
    }
  }

  // isShow = () => {
  //   if(this.state.isShow) {
  //     console.log('true')
  //     return {display:'true'}
  //   } else {
  //     console.log('none')
  //     return {display:'none'}
  //   }
  // }

  createAccount = () => {
    const me = this
    const newAccount = this.state
    console.log('newAccount',newAccount)
    for (let i in newAccount) {
      if (newAccount[i] === '' || newAccount[i] === undefined) {
        message.error('信息未填写完整！')
        return
      }
    }
    model.fetch(
      newAccount,
      originalUrl + user,
      'post',
      function (res) {
        message.success('创建账户成功！')
        me.props.getUsers()
        me.initState()
      },
      function (error) {
        message.error('创建账户失败！')
      }
    )
    this.props.handleOk('addAccountVisible')
  }

  initState = () => {
    const initData = {}
    const newAccount = this.state
    for (let i in newAccount) {
      initData[i] = ''
    }
    initData['role_id'] = undefined
    initData['power_id_str'] = '1'
    initData['alter_power'] = '1'
    initData['add_by'] = getUserName()
    this.setState(initData)
    this.props.handleCancel('addAccountVisible')
    document.getElementById('client_unit').style.display = 'none'
  }

  handleAllClient = () => {
    const { clientData } = this.props;
    const handleClientData = clientData.map((item) => (
        {
            data: item.client_unit + '/' + item.client_code,
            aid: item.aid
        }
    ))
    return handleClientData;
  }

  render() {
    const {
      visible,
      roles,
      
    } = this.props

    const {
      name,
      password,
      role_id,
      telephone_num,
      client_id
    } = this.state

    const allClient = this.handleAllClient();
    
    return (
      <Modal
        title="新增账户"
        visible={visible}
        onOk={() => this.createAccount()}
        onCancel={() => this.initState()}
      >
        <div className={"inputItem"}>
          <span>姓名：</span>
          <Input allowClear style={{ width: "200px" }} value={name} onChange={e => this.handleChange('name', e.target.value)}/>
        </div>
        <div className={"inputItem"}>
          <span>密码：</span>
          <Input allowClear style={{ width: "200px" }} value={password} onChange={e => this.handleChange('password', e.target.value)}/>
        </div>
        <div className={"inputItem"}>
          <span>角色：</span>
          <Select value={role_id} style={{ width: 200 }} onChange={(e) => this.handleChange('role_id', e)} allowClear>
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
        <div className={"inputItem"} id='client_unit' style={{display:'none'}}>
          <span>客户单位：</span>
          <Select value={client_id} style={{ width: 200 }} onChange={(e) => this.handleChange('client_id',e)} allowClear>
            {
              allClient.size !== 0?
              allClient.map((item, index) => {
                return <Option
                  value={item.aid}
                  key={item.aid}
                  onClick={() => {this.setState({client_id: item.aid})}}
                >{item.data}</Option>
              })
              : null
            }
          </Select>
        </div>
        <div className={"inputItem"}>
          <span>联系方式：</span>
          <Input allowClear style={{ width: "200px" }} value={telephone_num} onChange={e => this.handleChange('telephone_num', e.target.value)}/>
        </div>
      </Modal>
    )
  }
}
