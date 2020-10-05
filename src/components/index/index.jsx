import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../style/table.less';
// 使用ajax请求导入
// import { Model } from '../../dataModule/testBone'

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div style={{overflowX: 'auto', marginTop: 60}}>
        123
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps, null)(Index);
