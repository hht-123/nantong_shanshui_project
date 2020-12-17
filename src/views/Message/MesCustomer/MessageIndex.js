import React, { Component } from 'react';
import { Input,Button, message } from 'antd';
import '../../../style/wrapper.less';
import '../../Message/style/Message.less';
import MessageTable from './MessageTable';
import AddMesCustomer from './AddMesCustomer';
import {Model} from '../../../dataModule/testBone';
import {messageCUrl} from '../../../dataModule/UrlList';
import EditMesModal from './editMesModal';
import ContactModal from './ContactModal';
import { connect } from 'react-redux';


const model = new Model();

class MessageIndex extends Component{
    constructor(props){
        super(props);
        this.state={
            confirmLoading: false,
            currentPage: 1,
            isLoading: false,         //是否加载
            search: false,          //是否搜索
            whetherTest: false,     //是否是测试  true为是 false为否
            showPagination: true,   //是否分页
            data: [],               //表格数据 
            total: 0,              //一共有多少条数据
            keyValue: "",           //用于重置
            search_client_unit: "",        //客户单位
            Visible: false,   //addMesCustomer是否显示
            editModelVisible: false , //editModal是否显示
            editInfo: {},             //获取到编辑行的信息
            contactVisble: false,       //显示联系人弹窗
            client_id:{},              //获取客户的id并给联系人组件
            roleData: []                //获取角色权限
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
            messageCUrl,
            'get',
            function(response) {
                if (me.state.whetherTest === false) {
                    me.setState({
                        isLoading: false,
                        total: response.data.count,
                        data: response.data.results,
                        currentPage: params['currentPage']
                    })
                    // .log(me.state.data)
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

    getParams( currentPage = 1, size = 10, client_code = null, client_unit=null  ) {
        let params = {};
        params = {
            currentPage,
            size,
            client_code,
            client_unit,
        }
        return params;
    }


    //输入框的获取
    handleChange = (e) => {
        this.setState({
        [e.target.name] : e.target.value
        })
        // console.log(this.state.search_client_unit)
    }

    //搜索按钮
    searchInfo = () => {
        this.setState({search: true});
        const { search_client_unit } = this.state;
        let params = this.getParams( 1, 10,'', search_client_unit );
        this.getCurrentPage(params);
    }
    
    //重置按钮
    handleReset = () => {
        let params = this.getParams();
        this.getCurrentPage(params);
        this.setState({
            search_client_unit: null,
            keyValue: new Date(),
            currentPage: 1,
            search:false,
        })
    }

    //翻页获取内容
    getPage = (currentPage, pageSize) => {
        let [search_client_unit] = [null];
        if(this.state.search === true){
            search_client_unit = this.state.search_client_unit;
        }
        const params = this.getParams(currentPage, pageSize, '',search_client_unit)
        this.getCurrentPage(params);
    }

    //改变pageSize获取内容
    getSize = (current, size) => {
        let [search_client_unit] = [null];
        if(this.state.search === true){
            search_client_unit = this.state.search_client_unit;
        }
        const params = this.getParams(1, size, search_client_unit)
        this.getCurrentPage(params);
        document.scrollingElement.scrollTop = 0
    }

    //弹窗显示
    showAddModal = () =>  {
        this.setState({
            Visible: true,
        });
    };

    showContactModal = (record) => {
        this.setState({
            contactVisble: true,
        })
        record === undefined ? null :
        this.setState({
            client_id: record
        })
    }
    
    closeAddModal = () => {
        this.setState({
            Visible: false,
            editModalVisible: false,
            contactVisble: false,
        })
    }
    
    //显示编辑弹窗 
    showEditModal = (record) => {
        this.setState({
            editModalVisible: true,
        });
        // eslint-disable-next-line no-unused-expressions
        record === undefined ? null :
        this.setState({
            editInfo: record
        })
    }

    //删除数据
    deleteInfo = (record) => {
        let params = this.getParams()
        let me = this; 
        model.fetch(
            params,
            `${messageCUrl}${record}/`,
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

    render() {
        const {data , whetherTest} = this.state;
        const tableDate = [];
        if(data !== undefined){
            data.map((item) => {
                if( item.status === '1') {
                    tableDate.push({
                        key: item.aid,
                        client_code:item.client_code,
                        client_unit:item.client_unit,
                        client_address:item.client_address,
                        client_zip_code:item.client_zip_code,
                        client_industry:item.client_industry,
                        unit_phone:item.unit_phone,
                        unit_fax:item.unit_fax,
                        note: item.note,
                        region:item.region,
                    })
                }
            return null;
        })
        }
        const { roleData } = this.props
        if (this.state.client_id === undefined ) return null
        if (roleData.size === 0 ) return null


        return(
            <div>
                <div className='name'>客户信息：</div>
                <div className='wrapper'>
                    <div className='func' style={{height: 160}}>
                        <div className="inputWrapper" style={{ marginLeft: 0}}>
                            <div className="input">客户单位:</div>
                            <Input  
                                style={{width: "200px"}} 
                                name="search_client_unit" 
                                onChange={this.handleChange}
                                value={this.state.search_client_unit}
                            />
                        </div>
                        <div style={{marginTop: "40px",marginLeft: "260px"}}>
                            <Button type='primary' className="button" onClick={ this.searchInfo }>搜索</Button>
                            <Button className="button" onClick={this.handleReset}>重置</Button>
                            { roleData.map((item,index) => {
                                if ( item === 'user_manage') {
                                    return <Button type="primary" className="button" onClick={this.showAddModal} key={index}>创建客户信息</Button>
                                }
                                return null;
                            })}
                        </div>
                        <AddMesCustomer
                            whetherTest={whetherTest}
                            Visible={this.state.Visible}  //这里把state里面的Visible传递到子组件
                            cancel={this.closeAddModal}
                            getParams = {this.getParams.bind(this)}
                            getCurrentPage = { this.getCurrentPage.bind(this) }
                        />
                    </div>
                    <MessageTable
                        data={ tableDate }
                        isLoading={ this.state.isLoading }
                        showPagination={ this.state.showPagination }
                        size={ this.state.size }
                        total={ this.state.total }
                        changePage={ this.getPage }
                        changeSize={ this.getSize }
                        currentPage={ this.state.currentPage }
                        showEditModal={ this.showEditModal }
                        showContactModal = { this.showContactModal }
                        deleteInfo = { this.deleteInfo  }
                        roleData = { roleData }
                    />
                    <ContactModal
                        whetherTest={whetherTest}
                        cancel={ this.closeAddModal }
                        visible={ this.state.contactVisble }
                        client_id = { this.state.client_id }
                        roleData = { roleData }
                    />
                    <EditMesModal
                        whetherTest={ whetherTest }
                        visible={ this.state.editModalVisible }
                        cancel={ this.closeAddModal }
                        editInfo={ this.state.editInfo }
                        getParams = {this.getParams.bind(this)}
                        getCurrentPage = { this.getCurrentPage.bind(this) }
                    />
                </div>
                
           </div>  
        )
    }
}

const mapStateToProps = (state) => ({
    roleData: state.getIn(['index', 'roleData']),
})

export default connect(mapStateToProps, null)(MessageIndex);
