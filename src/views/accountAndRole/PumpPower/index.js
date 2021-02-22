/* eslint-disable no-unused-expressions */
import { Button, Input } from 'antd'
import React, { Component } from 'react'

import { Model } from '../../../dataModule/testBone'
import { pumpInfoUrl, pumpPowerAccountUrl } from '../../../dataModule/UrlList'

import PumpPowerTable from './PumpPowerTable'
import PumpPowerModal from './PumpPowerModal'

import '../../../style/wrapper.less'
import './style.less'

const model = new Model()

class PumpPower extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,   //表格数据是否加载
            search: false,    //判断是否搜索
            status: 1,
            pump_code: '',
            fluid_flow: '',
            currentPage: 1,
            size: 10,
            total: 0,
            data: [],
            powerVisible: false,
            accountData:[],
            pump_id:''
        }
    }

    //生命周期函数
    componentDidMount = () => {
        let params = this.getParams()
        this.getPumpData(params)
    }

    //活得泵的信息
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
                // console.log(6126,response.data)
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

    //获取泵的编号搜索值
    getPumpCode = (e) => {
        this.setState({
            pump_code: e.target.value
        })
    }  
    
    //搜索的参数
    getParams(currentPage=1, size=10, pump_code=null, status = 1){
        let params = {};
        params = {
            currentPage,
            size,
            status,
            pump_code
        }
        return params
    }

    //点击搜索
    getSearch = () => {
        const { pump_code, status } = this.state
        let params = this.getParams(1, 10, pump_code, status )
        this.getPumpData(params)
    }

    //点击重置
    handleReset = () => {
        const params = this.getParams()
        this.getPumpData(params)
        this.setState({
            status: 1,
            pump_code: '',
            search: false
        })
    }

    //翻页获取内容
    getNewPage = (currentPage, size) => {
        let pump_code = null
        const { status } = this.state
        if(this.state.search === true){
            pump_code = this.state.pump_code
        }
        const params = this.getParams(currentPage, size,pump_code, status)
        this.getPumpData(params)
    }

    //改变pageSIze获取内容
    getSize = (current, size) => {
        let pump_code = null
        const { status } = this.state;
        if(this.state.search === true){
            pump_code = this.state.pump_code
        }
        const params = this.getParams(1, size, pump_code,  status)
        this.getPumpData(params)
        document.scrollingElement.scrollTop = 0;
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
                fluid_flow: item.fluid_flow,
                equipment_code: item.equipment_code
            }))
            return tableDate;
        }
    }

    //打开泵的操作者弹窗
    showPowerModal = (record) => {
        this.setState({
            powerVisible: true,
            pump_id:record.key
        })
        this.getPowerAccount(record.key)
    }

    //获得泵的操作者信息
    getPowerAccount = (params) => {
        let me = this
        model.fetch(
            {pump_id:params},
            pumpPowerAccountUrl,
            'get',
            function(response) {
                me.setState({
                    isLoading: false,
                    accountData: response.data.data
                })
            },
            function() {
                console.log('加载失败，请重试')
            }
        )
    }

    //把泵的操作者数据存到表格里
    handleActionData = () => {
        const { accountData } = this.state
        if(accountData !== undefined) {
            const actionData = accountData.map((item) =>({
                key: item.permission_id,
                account: item.account,
                user_name: item.user_name,
                role_name: item.role_name
            }))
            return actionData;
        }
    }

    //关闭泵的操作者弹窗
    closeModal = (visible) => {
        this.setState({
            powerVisible: visible
        })
    }

    render(){
        const { pump_code, isLoading, size, total, currentPage, powerVisible, pump_id } = this.state
        const tableData = this.handleData()
        const actionData = this.handleActionData()
        return(
            <div>
                <div className='name'>泵的权限</div>
                <div className='wrapper'>
                    <div className="powerSearch">
                        <div style={{ fontSize: '20px', marginLeft: '40px'}}>泵的编号：</div>
                        <Input 
                            size = "small"
                            style={{width: "250px", marginLeft: "20px"}}
                            allowClear
                            value = { pump_code }
                            onChange={(e) => this.getPumpCode(e)}
                        />
                        <Button 
                            type="primary"
                            size = "default"
                            style = {{marginLeft: '60px'}}
                            onClick = { this.getSearch}
                        > 搜索 </Button>
                        <Button 
                            size = "default"
                            style = {{marginLeft: '40px'}}
                            onClick = {this.handleReset}
                        >重置</Button>
                    </div>
                    <div style={{width:"80%", marginBottom:"50px"}}>
                        <PumpPowerTable  
                            isLoading = { isLoading }
                            data = { tableData }
                            size = { size }
                            total = { total }
                            changePage = { this.getNewPage }
                            currentPage = { currentPage }
                            changeSize = { this.getSize }
                            showPowerModal = { this.showPowerModal }
                        />
                        <PumpPowerModal
                            powerVisible = { powerVisible }
                            cancel = { this.closeModal}
                            pumpdata = { actionData }
                            getPowerAccount = { this.getPowerAccount }
                            pumpId = { pump_id }
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PumpPower
