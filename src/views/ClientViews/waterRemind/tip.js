import React, { Component } from 'react';

import {  Button,  Modal, message } from 'antd';
import './style.less';
import { Model } from "../../../dataModule/testBone";
import { ClientWaterPutUrl } from '../../../dataModule/UrlList';

const { confirm } = Modal;
const model = new Model()
class Tip extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  showConfirm = () => {
    const me = this;
    confirm({
      title: '已处理该提示?',
      onOk() {
        me.dealStatus(me.props.tipData.aid)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  dealStatus = (aid)  => {
      let me = this
      model.fetch(
        '1:1',
        `${ClientWaterPutUrl}${aid}/`,
        'put',
        function() {
          const Newdata = me.props.getparams();
          me.props.getCurrentPage(Newdata)
          message.success('处理成功')
        },
        function() {
          message.warning('处理失败')
        },
        this.props.whetherTest
      )
  }

  render() {
    
    return (
        <div className='tip' >
            <div className='time' >{this.props.time}</div>
            <Button className='button' onClick={ this.showConfirm }>{this.props.tipData.notice_content}</Button>
        </div>
    )
  }
}

export default Tip;