import React, {Component} from "react";
import {Tree} from "antd";

const { TreeNode } = Tree;

export default class PowerTreeComponent extends Component{
  renderTreeNodes = data =>
    data.map(item => {
      if (this.props.rolePowers.indexOf(item.power_num) !== -1) {
        return <TreeNode key={item.power_num} title={<span style={{ color: '#1890ff' }}>{item.power}</span>} disabled/>;
      }
      return <TreeNode key={item.power_num} title={item.power} />;
    });

  render() {
    const { powers, rolePowers } = this.props

    return (
      <Tree
        checkable
        checkedKeys={rolePowers}
      >
        {this.renderTreeNodes(powers)}
      </Tree>
    )
  }
}
