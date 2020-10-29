import { message, Button } from 'antd';
import React, { Component } from 'react';
import ContactTable from './ContactTable';
import { Model } from '../../../dataModule/testBone';
import { contactUrl, messageCUrl } from '../../../dataModule/UrlList';
import AddModal from './AddModal';
import EditModal from './editModal';
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
            editModalVisible: false, //编辑弹窗的显示
            client_unit:'', //客户单位
            editInfo: {},             //获取到编辑行的信息
        }  
    }


    //生命周期函数
    componentDidMount() {
        let params = this.getParams();
        this.getCurrentPage(params);
        this.getClientUnit(this.props.client_id);
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
                    console.log(me.state.data)
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

    getParams( contact_person = null, client_id = this.props.client_id ) {
        let params = {};
        params = {
            contact_person,
            client_id,
        }
        return params;
    }

    //获得联系人对应的单位
    getClientUnit(client_aid) {
        let me = this;            //让this指向不会出错
        model.fetch(
            {'aid': client_aid},
            messageCUrl,
            'get',
            function(response) {
                if (me.state.whetherTest === false) {
                    me.setState({
                        client_unit: response.data.results[0].client_unit,
                    })
                } else {
                    me.setState({
                        client_unit: response.data.results.client_unit,
                    })
                }
            },
            function() {
                message.warning('加载失败，请重试')
            },
            this.state.whetherTest
        )
    }

     //弹窗显示
    showAddModal = () =>  {
        this.setState({
            Visible: true,
        });
    };

    //编辑弹窗的显示
    showEditModal = (record) => {
        this.setState({
            editModalVisible: true,
        });
        if ( record !== undefined ) {
            this.setState({editInfo:record})
          }
        // record === undefined ? null :
        // this.setState({
        //     editInfo: record
        // })
    }

    closeAddModal = () => {
        this.setState({
            Visible: false,
            editModalVisible: false
        })
    }



    //删除数据
    deleteInfo = (record) => {
        let params = this.getParams()
        let me = this; 
        model.fetch(
            params,
            `${contactUrl}${record}/`,
            'delete',
            function(response) {
                me.getCurrentPage(params)
            },
            function() {
                message.warning('加载失败，请重试')
            },
            this.state.whetherTest
        )
    }

    render(){
        // const client_id = this.props.client_id
        const {data, Visible, whetherTest, isLoading, editModalVisible, editInfo } = this.state;
        const tableDate = [];
        if(data !== undefined){
            data.map((item) => {            
            tableDate.push({
                key: item.aid,
                contact_person:item.contact_person,
                contact_position:item.contact_position,
                contact_tel:item.contact_tel,
                remark: item.remark
            })
            return null;
            })
        }

        return(
            <div className='contact' >
                    <div>
                        { this.props.roleData.map((item,index) => {
                            if ( item === 'user_manage') {
                                return <Button type="primary" className="but" onClick={this.showAddModal} key={index}>添加联系人</Button>
                            }
                            return null;
                        })}
                        <AddModal
                            whetherTest={ whetherTest }
                            Visible={ Visible }  //这里把state里面的Visible传递到子组件
                            cancel={ this.closeAddModal }
                            // client_id = { client_id }
                            getParams = { this.getParams.bind(this) }
                            getCurrentPage = { this.getCurrentPage.bind(this) }
                        />
                    </div>
                    <div>
                        <ContactTable
                            data={ tableDate }
                            isLoading={ isLoading }
                            showEditModal={ this.showEditModal }
                            deleteInfo = { this.deleteInfo  }
                            roleData = {this.props.roleData }
                        /> 
                        <EditModal
                            whetherTest={ whetherTest }
                            visible={ editModalVisible }
                            cancel={ this.closeAddModal }
                            editInfo={ editInfo }
                            getParams = {this.getParams.bind(this)}
                            getCurrentPage = {this.getCurrentPage.bind(this)}
                        />
                    </div>
            </div>
        )
    }
}

export default contactmes;