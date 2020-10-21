import React, { Component } from "react";
import {Modal} from "antd";

export default class EditPower extends Component {
  render() {
    const {
      visible,
      handleOk,
      handleCancel
    } = this.props

    return (
      <Modal
        title="权限编辑"
        visible={visible}
        onOk={() => handleOk('editPowerVisible')}
        onCancel={() => handleCancel('editPowerVisible')}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    )
  }
}
