import React, { Component } from "react";
import { Modal, Tree  } from "antd";

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


  render() {
    const {
      visible,
      handleOk,
      handleCancel,
      powers,
      accountPowersOfSelectedAccount
    } = this.props

    return (
      <Modal
        title="权限编辑"
        visible={visible}
        onOk={() => handleOk('editPowerVisible')}
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
