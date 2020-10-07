import React, { Component } from 'react';
import { Input,Button, message } from 'antd';
import '../../style/wrapper.less';
import '../Message/style/Message.less';
import MessageTable from './MessageTable';
import AddMesCustomer from './AddMesCustomer';
import {Model} from '../../dataModule/testBone';


const model = new Model();


class MessageIndex extends Component{
    constructor(props){
        super(props);
        this.state={
            confirmLoading: false,
            whetherTest: false,     //是否是测试  true为是 false为否
            url:'Mes/',
            showPagination: true,   //是否分页
            isLoading: false,       //是否加载
            data: [],               //表格数据 
            total: 0,              //一共有多少条数据
            keyValue: "",           //用于重置
            client_unit: "",        //客户单位
            Visible: false,   //addMesCustomer是否显示
            editModelVisible: false  //editModal是否显示
        }
        //this.handleChange = this.handleChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        /* this.getPage = this.getPage.bind(this);
        this.getSize = this.getSize.bind(this); */
        this.showAddModal = this.showAddModal.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);
        //this.showEditModal = this.showEditModal.bind(this);
    }

    //生命周期
    componentDidMount() {
        let startParams = {
          currentPage: 1,
          page: 1,
          size: 10,
        }
        this.getCurrentPage(startParams);
    }

    
    getCurrentPage(params) {
        for (let i in params) {
            if (params[i] === null) {
                params[i] = ''
            }
        }
        let me = this;            //让this指向不会出错
        this.setState({isLoading: true})
        model.fetch(
            params,
            me.state.url,
            'get',
            function(response) {
                if (me.state.whetherTest === false) {
                me.setState({
                    isLoading: false,
                    total: response.data.count,
                    data: response.data.data,
                    currentPage: params['currentPage']
                })
                } else {
                    me.setState({
                        isLoading: false,
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
    
    //重置按钮
    handleReset(){
        this.setState({
            client_unit:"",
            keyValue: new Date()
        })   
    };

    //弹窗显示
    showAddModal = () =>  {
        this.setState({
            Visible: true,
        });
    };
    
    closeAddModal() {
        this.setState({
            Visible: false
        })
    };
    
    showEditModal() {
        this.setState({
          editModalVisible: true,
        });
    };
   

    render(){
        const {data , whetherTest} = this.state;
        const tableDate = [];
        data.map((item) => {
        tableDate.push({
            key: item.aid,
            client_code:item.client_code,
            client_unit:item.client_unit,
            client_address:item.client_address,
            client_zip_code:item.client_zip_code,
            client_industry:item.client_industry,
            unit_phone:item.unit_phone,
            unit_fax:item.unit_fax,
            client_province:item.client_province,
            note: item.note
        })
        return null;
        })


        return(
            <div>
                <div className="name">客户信息</div>
                <div  className="wrapper">
                        <div className="style">
                            <div className="text">客户单位：</div>
                            <div className="div">
                                <div className="left">
                                    <Input  
                                        style={{width: "200px"}} 
                                        name="client_unit" 
                                        onChange={this.handleChange}
                                        value={this.state.client_unit}
                                    />
                                </div>
                                <div>
                                    <div className="right">
                                        <Button type="primary" className="span" >搜索</Button>
                                        <Button type="primary" className="span" onClick={this.handleReset}>重置</Button>
                                        <Button type="primary" className="span" onClick={this.showAddModal}>创建客户信息</Button>
                                    </div>
                                        <AddMesCustomer
                                            whetherTest={whetherTest}
                                            Visible={this.state.Visible}  //这里把state里面的Visible传递到子组件
                                            cancel={this.closeAddModal}
                                        />
                                </div>
                            </div>
                        </div>  
                        <div className="table">
                            <MessageTable/>
                        </div> 
                </div> 
           </div>  
        )
    }


   
}
export default MessageIndex;