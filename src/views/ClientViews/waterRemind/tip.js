import React, { Component } from 'react';

import {  Button,  Modal } from 'antd';
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
        let Newdata = me.props.getparams();
        me.props.getCurrentPage(Newdata)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  dealStatus = (aid)  => {
      model.fetch(
        '1:1',
        `${ClientWaterPutUrl}${aid}/`,
        'put',
        function() {
          console.log('success')
        },
        function() {
          console.log('加载失败，请重试')
        },
        this.props.whetherTest
      )
      // let Newdata = this.props.getparams();
      //   this.props.getCurrentPage(Newdata)
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