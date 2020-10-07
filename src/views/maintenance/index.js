import React, { Component } from 'react';
import { Input, Select, Button } from 'antd';

import { Model } from '../../dataModule/testBone';


import '../maintenance/style/index.less';
import  Equipment   from '../maintenance/publicComponents/equipment.js';



const model = new Model()

class MaintenanceIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            equipment_number:'',
            user_company: '',
            status: '0',
            area:''
        }
        this.changeValue = this.changeValue.bind(this);
        
      }
    
    componentDidMount() {
        const me = this
        model.fetch(
            123,
            'api/MaintenanceIndex.json',
            'get',
            function(response) {
                if (me.props.whetherTest === false) {
                  me.setState({
                    data: response.data,
                  })
                } else {
                  me.setState({
                    data: response.data.data
                  })
                }
              },
              function() {
                console.log('加载失败，请重试')
              },
              this.props.whetherTest
        )

        
    }

    handleChange = (value) => {
      console.log(value);
      this.setState({
        status: value
      })
    }

  render() {

    const { Option } = Select;

    //将数据分组
    let getGroup = (data,key) => {
      let groups = {};
      data.forEach( c => {
          let value = c[key];
          groups[value] = groups[value]||[];
          groups[value].push(c);
      });
      return groups;
    }
    const Newdata = getGroup(this.state.data,'area')
    // console.log(Newdata)
  
    
    return (
        <div>
            <div className="title" style={{overflowX: 'auto', marginTop: 60}}>
                循环水智慧管家远程监控系统
            </div>
            <div className='line-top'></div>
            <div className='Search'>
                <div className='search-area'>地区筛选:</div>
                <Input className='area' name='area' value={ this.state.area } onChange={ this.changeValue} />
                <div className='search-user'>用户单位:</div>
                <Input className='user' name='user_company' value={ this.state.user_company } onChange={ this.changeValue} />
                <div className='search-status'>设备状态:</div>
                <div className='status'>
                    <Select size='small' defaultValue="0" style={{ width: 120, }} onChange={this.handleChange}>
                        <Option value="0">在线</Option>
                        <Option value="1">报修</Option>
                        <Option value="2">停运</Option>
                        <Option value="3">维护</Option>
                    </Select>
                </div>
                <div className='button1'>
                    <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                </div>
                <div className='button2'>
                    <Button onClick={this.handleClear} >重置</Button>
                </div>
                <div className='button3'>
                    <Button type="primary">新增交付属性</Button>
                </div>
            </div >
            {Object.keys(Newdata).map((key,index) => 
                <div key={index} className='content' >
                    <div className="areaName" style={{overflowX: 'auto', marginTop: 40}}>{key}</div>
                    <div className='line-bottom'></div>
                    { Newdata[key].map((item,index) => {
                      return <Equipment key={index} equipment_number={item.equipment_number} user_company={item.user_company} status={item.status} />
                    })}
                </div>
            )}
        </div>
    )
  }

  changeValue = (e) => {
    const newForm = {...this.state}
    newForm[e.target.name] = e.target.value
    this.setState(newForm)
    console.log(this.state)
  }  

  handleClear= () => {
    this.setState({
     user_company: '',
     status: '0',
     area:''
    })
  }

  handleSearch = () => {
    const Searchinfo = this.state
    const me = this
    model.fetch(
      Searchinfo,
      'api/MaintenanceIndex.json',
      'get',
      function(response) {
        if (me.props.whetherTest === false) {
          me.setState({
            data: response.data,
          })
        } else {
          me.setState({
            data: response.data.data
          })
        }
      },
      function() {
        console.log('加载失败，请重试')
      },
      this.props.whetherTest
    )
  }

}




export default MaintenanceIndex;