import React, { Component } from "react";
import {Modal} from "antd";

import { Model } from '../../../dataModule/testBone'
import {originalUrl, user} from "../../../dataModule/UrlList";

const model = new Model()

export default class DeleteAccount extends Component{
  deleteAccount = (aid) => {
    const me = this
    model.fetch(
      {},
      originalUrl + user + aid,
      'delete',
      function (res) {
        console.log(res)
        me.props.getUsers()
      }
    )
    this.props.handleOk('delAccountVisible')
  }

  render() {
    const {
      visible,
      handleCancel,
      record
    } = this.props

    return (
      <Modal
        title="确认删除该账户？"
        visible={visible}
        okType={"danger"}
        okText={"删除"}
        onOk={() => this.deleteAccount(record.aid)}
        onCancel={() => handleCancel('delAccountVisible')}
      >
        <p>姓名：{ record.name }</p>
        <p>账户：{ record.account }</p>
      </Modal>
    )
  }
}
