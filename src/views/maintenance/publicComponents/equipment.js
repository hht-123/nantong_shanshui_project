import React, { Component } from 'react';

// import { Model } from '../../../dataModule/testBone';

import '../style/equipmentStyle.less';
import Shebei from '../../../statistics/shebei.png';

class Equipment extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  handleStatus = (numb) => {
    if ( numb === '0' ) {
      return  '在线'
    }else if (numb === '1') {
      return  '报修'
    }else if (numb === '2') {
      return  '停运'
    }else if (numb === '3') {
      return  '维护'
    }
  }

  handleStatusColor = (numb) => {
    if ( numb === '0' ) {
      return  { background:'green'}
    }else if (numb === '1') {
      return  { background:'red'}
    }else if (numb === '2') {
      return  { background:'gray'}
    }else if (numb === '3') {
      return  { background:'bule'}
    }
  }

  enterEquipment = () => {
    console.log(this.props.equipment_number)
  }

  render() {
    
    return (
                <span className='equipment'>
                    <img className='Pic-equipment' alt='shebei' src={ Shebei } onClick={ this.enterEquipment } />
                    <div className='equipmentID'>{ this.props.equipment_number }</div>
                    <div className='company'>{ this.props.user_company }</div>
                    <div className='status' style={ this.handleStatusColor(this.props.status) } > { this.handleStatus(this.props.status) }</div>
                </span>
    )
  }
}

export default Equipment;