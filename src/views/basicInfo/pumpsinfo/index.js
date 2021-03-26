import React, { Component } from 'react'
import { Input, Select, Button, message } from 'antd'

import PumpsTable from './PumpsTable'
import AddPumpModal from './AddPumpModal'
import EditPumpModal from './EditPumpModal'

import { Model } from '../../../dataModule/testBone'

import { pumpInfoUrl, verifyUrl } from '../../../dataModule/UrlList'
import {getUserId, getRoleId}  from '../../../publicFunction/index'

import '../../../style/wrapper.less'
import './style.less'

const { Option } = Select
const model = new Model()

class PumpInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: false,          //是否搜素
            addModalVisible: false, //是否打开增加弹窗
            pump_code: '',          //泵的编号
            status: '',        //泵的状态
            keyValue: '',          //用于重置
            currentPage: 1,
            size: 10,              //每页10条数据
            data: [],              //表格数据 
            total: 0,              //一共有多少条数据
            isLoading: false,       //表格是否加载
            EditPumpVisible: false,     //是否打开编辑弹窗
            editInfo: {},             //获取到编辑行的信息
            roleData: []
        }
    }

    //生命周期
    componentDidMount() {
        let params = this.getParams()
        // console.log(44,params)
        this.getPumpData(params)
        this.getRoleData()
    }

    //获得搜索泵的编号
    getPumpCode = (e) => {
        this.setState({
            pump_code: e.target.value
        })
        // console.log(22,this.state.pump_code)
    }

    //获取搜索泵的状态
    getPumpStatus = (string) => {
        this.setState({
            status: string
        })
        // console.log(11, this.state.status)
    }

    //搜索的参数
    getParams(currentPage=1, size=10, status=null, pump_code=null){
        let params = {};
        params = {
            currentPage,
            size,
            status,
            pump_code
        }
        return params
    }

    //获得泵表数据
    getPumpData = (params) => {
        for (let i in params) {
            if (params[i] === undefined || params[i] === null) {
              params[i] = ''
            }
        }
        let me = this
        this.setState({isLoading: true})
        model.fetch(
            params,
            pumpInfoUrl,
            'get',
            function(response) {
                // console.log(66,response.data)
                me.setState({
                    isLoading: false,
                    total: response.data.count,
                    data: response.data.results,
                    currentPage: params['currentPage'],
                    size: params['size'],
                })
            },
            function() {
                console.log('加载失败，请重试')
            }
        )
    }

    //获取搜索内容
    getSearchContent = () => {
        this.setState({
            search: true
        })
        const { status, pump_code } = this.state
        let params = this.getParams(1, 10, status,  pump_code )
        // console.log(33, params)
        this.getPumpData(params)
    }

    //重置功能
    handleReset = () => {
        const params = this.getParams()
        // console.log(55,params)
        this.getPumpData(params)
        this.setState({
            status:'',
            pump_code: '',
            keyValue: new Date(),
            search: false
        })
    }

    //打开弹窗 ext为改行的内容
    AddNewPump = () => {
        this.setState({
            addModalVisible: true
        })
    }

    //打开编辑弹窗
    showEditModal = (record) => {
        this.setState({
            EditPumpVisible: true
        });
        // eslint-disable-next-line no-unused-expressions
        record === undefined ? null : this.setState({editInfo:record})
        // console.log(46, this.state.editInfo)
    }

    //关闭弹窗
    closeModal = (visible) => {
        this.setState({
            addModalVisible: visible,
            EditPumpVisible: visible
        })
    }

    //增加，编辑之后保持搜索条件不变或者刷新页面
    afterCreateOrEdit = () => {
        let pump_code = null
        const { status, size, currentPage } = this.state
        if(this.state.search === true){
            pump_code = this.state.pump_code;
        }
        const params = this.getParams(currentPage, size, status, pump_code)
        // console.log(22)
        this.getPumpData(params)
    }

    //把数字状态改成文字显示
    statusSWift(status) {
        if(status === '1'){
          return '已使用'
        }else if(status === '0'){
          return '未使用'
        }else if(status === '2'){
            return '已报废'
        }
    }

    //把数据存到泵表中
    handleData = () => {
        const { data } = this.state;
        if(data !== undefined) {
            const tableDate = data.map((item) =>({
                key: item.pump_id,
                create_time: item.create_time,
                pump_code: item.pump_code,
                pump_name: item.pump_name,
                equipment_code: item.equipment_code,
                fluid_flow: item.fluid_flow,
                mod_time: item.mod_time,
                status: this.statusSWift(item.status),
                note: item.note
            }))
            return tableDate;
        }
    }

    //翻页获取内容
    getNewPage = (currentPage, size) => {
        let pump_code = null
        const { status } = this.state
        if(this.state.search === true){
            pump_code = this.state.pump_code
        }
        const params = this.getParams(currentPage, size, status, pump_code)
        // console.log(555,params)
        this.getPumpData(params)
    }

    //改变pageSIze获取内容
    getSize = (current, size) => {
        let pump_code = null
        const { status } = this.state;
        if(this.state.search === true){
            pump_code = this.state.pump_code
        }
        const params = this.getParams(1, size, status, pump_code)
        // console.log(9, params)
        this.getPumpData(params)
        document.scrollingElement.scrollTop = 0;
    }

    //报废泵
    deletePump = (record) => {
        let params = this.getParams()
        // console.log(23,params)
        let me = this; 
        // console.log(56,record)
        model.fetch(
            params,
            `${pumpInfoUrl}${record}/`,
            'delete',
            function(response) {
                message.success('删除成功')
                me.afterCreateOrEdit(params)
            },
            function() {
                console.log('删除失败，请重试')
            },
        )
    }

    getRoleData() {
        const me = this
        model.fetch(
          {'user_id': getUserId(), 'role_id': getRoleId()},
          verifyUrl,
          'get',
          function(response) {
            me.setState({
              roleData: response.data.power_num
            })
        },
        function() {
          console.log('失败'); //失败信息
        },
        )
    }
    
        
    render(){
        const { addModalVisible, keyValue, pump_code, size, total, currentPage, isLoading, EditPumpVisible, editInfo, roleData } = this.state
        const tableData = this.handleData();
        return(
            <div>
                <div className='name'>控制泵信息：</div>
                <div className='wrapper'>
                    <div className="pumpsearch">
                        <div className="searchflex">
                            <div>
                                <div className="titles">泵的编号:</div>
                                <Input 
                                    style={{width: "250px"}}
                                    value={pump_code}
                                    onChange={(e) => this.getPumpCode(e)}
                                />
                            </div>
                            <div style={{marginLeft:"20px"}}>
                                <div className="titles">状态:</div>
                                <Select 
                                    style={{ width: "250px" }}
                                    allowClear
                                    onSelect={ (string) => this.getPumpStatus(string) }
                                    key={ keyValue }
                                >
                                    <Option value="0">未使用</Option>
                                    <Option value="1">已使用</Option>
                                    <Option value="2">已报废</Option>
                                </Select>
                            </div>
                            <div className="pumpbuttons">
                                <Button onClick={this.getSearchContent} >搜索</Button>
                                <Button onClick={this.handleReset} style={{marginLeft:'20px'}}>重置</Button>
                                { Array.from(roleData).map((item,index) => {
                                    if ( item === 'pump_information_management') {
                                        return <Button type="primary" onClick={() => this.AddNewPump()} key={index} style={{marginLeft:'20px'}}>新增控制泵</Button>                  
                                    }
                                    return null; 
                                })}
                            </div>
                            <AddPumpModal
                                addPumpVisible = { addModalVisible }
                                cancel = { this.closeModal }
                                getParams = { this.getParams }
                                afterCreateOrEdit = { this.afterCreateOrEdit }
                            />
                        </div>
                    </div>
                    <div style={{width:"100%", marginBottom:"50px"}}>
                        <PumpsTable
                            isLoading = { isLoading }
                            data = { tableData }
                            size = { size }
                            total = { total }
                            changePage = { this.getNewPage }
                            currentPage = { currentPage }
                            changeSize = { this.getSize }
                            deletePump = { this.deletePump }
                            showEditModal = { this.showEditModal }
                            roleData = { roleData }
                        />
                        <EditPumpModal
                            EditPumpVisible = { EditPumpVisible }
                            cancel = { this.closeModal }
                            getParams = { this.getParams }
                            editInfo={ editInfo }
                            afterCreateOrEdit = { this.afterCreateOrEdit }
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PumpInfo;