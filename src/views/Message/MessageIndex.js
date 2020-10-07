import React, { Component } from 'react';
import { Input,Button,  } from 'antd';
import '../../style/wrapper.less';
import '../Message/style/Message.less';
import MessageTable from './MessageTable';
import AddMesCustomer from './AddMesCustomer';
//import {Model} from '../../dataModule/testBone';


//const model = new Model();


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
            visible: false ,        //Modal是否显示
            Visible: false,   //addMesCustomer是否显示
            editModelVisible:  false  //editModal是否显示
        }
        //this.handleChange = this.handleChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        /* this.getPage = this.getPage.bind(this);
        this.getSize = this.getSize.bind(this); */
        this.showAddModal = this.showAddModal.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
    }
    
    //弹窗显示
    showAddModal()  {
        this.setState({
            Visible: true,
        });
      };
    
    closeAddModal() {
        this.setState({
            Visible: false
        })
      }
    
    showEditModal() {
        this.setState({
          editModalVisible: true,
        });
      }
    
    handleOk = e => {
    console.log(e);
    this.setState({
        visible: false,
    });
    };

    handleCancel = e => {
    console.log(e);
    this.setState({
        visible: false,
    });
    };

    //重置按钮
    handleReset(){
        this.setState({
            client_unit:"",
            keyValue: new Date()
        })   
    }



    render(){
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
                                            /* whetherTest={this.whetherTest}
                                            visible={this.state.Visible}
                                            cancel={this.closeAddMesCus} */
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