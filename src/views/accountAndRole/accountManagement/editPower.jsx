import React, { Component } from "react";
import {message, Modal, Tree} from "antd";
import {Model} from '../../../dataModule/testBone'
import {originalUrl, user} from "../../../dataModule/UrlList";

const model = new Model();
const { TreeNode } = Tree;

export default class EditPower extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
  }

  onCheck = (checkedKeys, info) => {
    this.props.changeAccountPowersOfSelectedAccount(checkedKeys)
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (this.props.rolePowersOfSelectedAccount.indexOf(item.power_num) !== -1) {
        return <TreeNode key={item.power_num} title={item.power} disabled/>;
      }
      return <TreeNode key={item.power_num} title={item.power} />;
    });

  changePower = () => {
    const powerIdList = []
    const {powersObject, record} = this.props
    for (let i = 0; i < this.props.accountPowersOfSelectedAccount.length; i++) {
      powerIdList.push(powersObject[this.props.accountPowersOfSelectedAccount[i]]['aid'])
    }
    const powersString = powerIdList.join(',')
    const params = {}
    params['alter_power'] = 'yes'
    params['power_id_str'] = powersString
    console.log(params, record)
    model.fetch(
      params,
      originalUrl + user + record.aid + '/',
      'put',
      function (res) {
        message.success('修改权限成功！')
      },
      function (err) {
        message.error('修改权限失败！')
      }
    )
    this.props.handleOk('editPowerVisible')
  }


  render() {
    const {
      visible,
      handleCancel,
      powers,
      accountPowersOfSelectedAccount
    } = this.props

    return (
      <Modal
        title="权限编辑"
        visible={visible}
        onOk={() => this.changePower()}
        onCancel={() => handleCancel('editPowerVisible')}
      >
        <Tree
          checkable
          onCheck={this.onCheck}
          checkedKeys={accountPowersOfSelectedAccount}
        >
          {this.renderTreeNodes(powers)}
        </Tree>
      </Modal>
    )
  }
}
