import React, { Component } from 'react';

import { Link } from 'react-router-dom'
import {  Button,  Modal } from 'antd';
import './style.less';


const { confirm } = Modal;
class Tip extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  showConfirm = () => {
    confirm({
      title: '已处理该提示?',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    
    return (
        <div className='tip' >
            <div className='time' >2019-05-12 10：33</div>
            <Button className='button' onClick={ this.showConfirm }>Confirm</Button>
        </div>
    )
  }
}

export default Tip;