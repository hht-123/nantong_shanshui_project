import { Tabs, message } from 'antd';
import React, { Component } from 'react';
import CusTable from './CusTable';
import ContactTable from './ContactTable';
import {Model} from '../../../dataModule/testBone';
import { messageCUrl} from '../../../dataModule/UrlList';

import '../../../style/wrapper.less';

const model = new Model(); 

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
};


class BaseMessage extends Component{

    constructor(props){
        super(props);
        this.state={
            confirmLoading: false,
            data: [],               //表格数据 
            total: 0,              //一共有多少条数据
            whetherTest: false,     //是否是测试  true为是 false为否
        }  
    }


    //获取数据
    componentDidMount() {
        let me = this;            //让this指向不会出错
        model.fetch(
            123,
            messageCUrl,
            'get',
            function(response) {
                if (me.state.whetherTest === false) {
                    me.setState({
                        total: response.data.count,
                        data: response.data,
                    })
                } else {
                    me.setState({
                        data: response.data.data,
                    })
                }
            },
            function() {
                message.warning('加载失败，请重试')
            },
            this.state.whetherTest
        )
    }

  /*   getParams(currentPage=1, size=10, client_unit=null) {
        let params = {};
        params = {
          currentPage,
          size,
          client_unit,
        }
        return params;
      } */


    render(){
        const {data} = this.state;
        const tableDate = [];
        data.map((item) => {
        tableDate.push({
            key: item.aid,
            client_unit:item.client_unit,
            client_address:item.client_address,
            client_zip_code:item.client_zip_code,
            client_industry:item.client_industry,
            unit_phone:item.unit_phone,
            unit_fax:item.unit_fax,
            note: item.note
        })
        return null;
        })

        return(
            <div>
                <div className="name">客户单位：</div>
                <div className="wrapper">
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane tab="客户基本信息" key="1">
                            <CusTable 
                                data={ tableDate }
                                size={ this.state.size }
                                total={ this.state.total }
                         
                            />
                        </TabPane>
                        <TabPane tab="联系人" key="2">
                            <ContactTable/> 
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default BaseMessage;