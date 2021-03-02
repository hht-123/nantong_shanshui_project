import React, { Component } from "react";
import {Input, message, Modal, Select} from "antd";
import {
  getUserId, 
  // getUserName
} from "../../../publicFunction";
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
      power_id_str: '',
      power_num_str: '',
      alter_power: 'no',
      client_id:undefined,
      isShow:false
    }
  }

  handleChange = (key, value) => {
    const rawState = this.state
    rawState[key] = value
    this.setState(rawState)
    // console.log(rawState)
    if(rawState['role_id'] === "9ca9088b74694db5a1b4594bcb8b2912") {
      this.setState({
        isShow: true
      })
    } else {
      this.setState({
        isShow: false
      })
    }
  }

  createAccount = () => {
    const me = this
    const newAccount = this.state
    // console.log(newAccount)
    for (let i in newAccount) {
      // console.log(newAccount[i])
      if (newAccount[i] === '' || newAccount[i] === undefined) {
        // console.log(i)
        if (i !== 'power_id_str' && i !== 'power_num_str' && i !== 'client_id' && i !== 'alter_power' && i !== 'add_by' ) {
          message.error('信息未填写完整！')
          return
        }
      }
    }
    newAccount['add_by'] = getUserId()
    model.fetch(
      newAccount,
      originalUrl + user + this.props.record.aid + '/',
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
    initData['client_id'] = undefined
    this.setState(initData)
    this.props.handleCancel('basicInfoVisible')
    this.setState({
      isShow: false
    })
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

  inputClientUnit = (id) => {
    const { clientData } = this.props;
    if(id === undefined ) return null
    // console.log(id)
    for (let i = 0;i < clientData.length; i++) {
      if(clientData[i].aid === id) {
        return clientData[i].client_unit + '/' + clientData[i].client_code
      } 
    }
  }

  render() {
    const {
      visible,
      roles,
      record,
      rolesObject,
      clientData
    } = this.props

    const {
      name,
      password,
      role_id,
      telephone_num,
      client_id
    } = this.state

    const allClient = this.handleAllClient();
    if(rolesObject === null ) return null

    return (
      <Modal
        title="编辑基础信息"
        visible={visible}
        onOk={() => this.createAccount()}
        onCancel={() => this.initState()}
        destroyOnClose={true}
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
        {
          // rolesObject[record.role_id] === '客户' && this.state.isShow ?
          this.state.isShow ?
          <div className={"inputItem"} style={{display:'block'}} id='client_unit2'  >
            <span>客户单位：</span>
            <Select placeholder={clientData === null ? undefined : this.inputClientUnit(record.client_id)}  value={client_id} style={{ width: 200 }} onChange={(e) => this.handleChange('client_id',e)} allowClear>
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
          : null
        }
        <div className={"inputItem"}>
          <span>联系方式：</span>
          <Input placeholder={record.telephone_num} allowClear style={{ width: "200px" }} value={telephone_num} onChange={e => this.handleChange('telephone_num', e.target.value)}/>
        </div>
      </Modal>
    )
  }
}
