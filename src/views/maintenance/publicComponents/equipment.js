import React, { Component } from 'react';

// import { Model } from '../../../dataModule/testBone';
import { Link } from 'react-router-dom'

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
    }else if (numb === '3') {
      return  '报修'
    }else if (numb === '4') {
      return  '维护'
    }
  }

  handleStatusColor = (numb) => {
    if ( numb === '0' ) {
      return  { background:'green'}
    }else if (numb === '3') {
      return  { background:'red'}
    }else if (numb === '4') {
      return  { background:'blue'}
    }
  }

  enterEquipment = () => {
    console.log(this.props.equipment_code)
  }

  render() {
    
    return (
                <span className='equipment'>
                  <Link to={`/app/monitor/${ this.props.aid }`} >
                    <img className='Pic-equipment' alt='设备图像' src={ Shebei } onClick={ this.enterEquipment } />
                  </Link>  
                    <div className='equipmentID'>{ this.props.equipment_code }</div>
                    <div className='company'>{ this.props.client_unit } </div>
                    <div className='status' style={ this.handleStatusColor(this.props.status) } > { this.handleStatus(this.props.status) }</div>
                </span>
    )
  }
}

export default Equipment;