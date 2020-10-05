import React, { Component } from 'react';

import { Model } from '../../../dataModule/testBone';

import '../style/equipmentStyle.less';
import Shebei from '../../../statistics/shebei.png';

class Equipment extends Component {

  render() {

    return (
                <div className='equipment'>
                    <img className='Pic-equipment' alt='shebei' src={Shebei} />
                    <div className='equipmentID'>S1905190101</div>
                    <div className='company'>一汽锡柴</div>
                    <div className='status'>报修</div>
                </div>
    )
  }
}

export default Equipment;