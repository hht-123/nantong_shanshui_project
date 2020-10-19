import { message, Button } from 'antd';
import React, { Component } from 'react';
import ContactTable from './ContactTable';
import {Model} from '../../../dataModule/testBone';
import { contactUrl} from '../../../dataModule/UrlList';
import AddModal from './AddModal';
import '../style/CusTable.less'

const model = new Model(); 


class contactmes extends Component{

    constructor(props){
        super(props);
        this.state={
            confirmLoading: false,
            data: [],               //表格数据 
            whetherTest: false,     //是否是测试  true为是 false为否
            isLoading: false,       //是否加载
            Visible: false,   //addMesContactr是否显示
        }  
    }


    //生命周期函数
    componentDidMount() {
        let params = this.getParams();
        this.getCurrentPage(params);
    }

    //获取数据
    getCurrentPage(params) {
        for (let i in params) {
            if (params[i] === undefined || params[i] === null) {
              params[i] = ''
            }
        }
        let me = this;            //让this指向不会出错
        this.setState({isLoading: true})
        model.fetch(
            params,
            contactUrl,
            'get',
            function(response) {
                if (me.state.whetherTest === false) {
                    me.setState({
                        isLoading: false,
                        data: response.data,
                    })
                    // console.log(me.state.data)
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

    getParams( contact_person = null, client_id = this.props.match.params.client_id ) {
        let params = {};
        params = {
            contact_person,
            client_id,
        }
        return params;
    }

     //弹窗显示
    showAddModal = () =>  {
        this.setState({
            Visible: true,
        });
    };

    closeAddModal = () => {
        this.setState({
            Visible: false,
            //editModalVisible: false,
        })
    }



    render(){
        const client_id = this.props.match.params.client_id
        const {data} = this.state;
        const tableDate = [];
        if(data !== undefined){
            data.map((item) => {            
            tableDate.push({
                key: item.aid,
                contact_person:item.contact_person,
                contact_position:item.contact_position,
                contact_tel:item.contact_tel,
                note: item.note
            })
            return null;
            })
        }

        return(
            <div>
                <div className="name">客户单位：</div>
                <div className="wrapper">
                    <div>
                        <Button type="primary" className="but" onClick={this.showAddModal}>添加联系人</Button>
                        <AddModal
                            whetherTest={this.state.whetherTest}
                            Visible={this.state.Visible}  //这里把state里面的Visible传递到子组件
                            cancel={this.closeAddModal}
                            client_id = {client_id}
                            getParams = {this.getParams.bind(this)}
                            getCurrentPage = {this.getCurrentPage.bind(this)}
                        />
                    </div>
                    <div>
                        <ContactTable
                            data={ tableDate }
                            isLoading={ this.state.isLoading }
                            showEditModal={ this.showEditModal }
                        /> 
                    </div>
                </div>
            </div>
        )
    }
}

export default contactmes;