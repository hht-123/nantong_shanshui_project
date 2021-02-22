import { Button, Modal, message } from 'antd'
import React, { Component } from 'react'

import {getUserId }from '../../../publicFunction'

import { Model } from '../../../dataModule/testBone'
import { pumpActionDeleteUrl, addPumpActionUrl } from '../../../dataModule/UrlList'

import PumpActionTable from './PumpActionTable'
import AddActionModal from './AddActionModal'

const model = new Model()

class PumpPowerModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,   //表格数据是否加载
            pump_id: '',
            accountData:[],
            addModalVisible: false,    //添加操作者弹窗是否打开
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.pumpdata !==  prevProps.pumpdata){
            const { pumpdata } = this.props
            this.setState({
                accountData: pumpdata,
            })
        }
    }

    //关闭泵的操作者弹窗
    handleCancel = () => {
        this.props.cancel(false)
    }

    //打开添加操作者弹窗
    addActions = () => {
        this.setState({
            addModalVisible: true
        })
    }

    //关闭添加操作者弹窗
    closeModal = () => {
        this.setState({
            addModalVisible: false
        })
    }

    //删除操作者
    deleteAction = (record) => {
        let params = this.props.pumpId
        let me = this
        model.fetch(
            {},
            `${pumpActionDeleteUrl}${record.key}/`,
            'delete',
            function(){
                message.success('删除成功')
                me.props.getPowerAccount(params)
            },
            function(){
                console.log('删除失败')
            }
        )
    }

    //添加泵的操作者
    addPumpAction = (params) => {
        let me = this
        let parameter = this.props.pumpId
        model.fetch(
            {
                user_id: params,
                pump_id: parameter,
                create_by: getUserId()
            },
            addPumpActionUrl,
            'post',
            function(){
                message.success('添加成功')
                me.props.getPowerAccount(parameter)
            }
        )
    }

    render(){
        const { addModalVisible, isLoading, accountData } = this.state
        const { powerVisible } = this.props
        return(
            <Modal
                title="泵的操作者"
                visible={ powerVisible }
                width = '1000px'
                onCancel={this.handleCancel}
                footer = {[
                    <Button  key="back" onClick={this.handleCancel}>取消</Button>
                ]}
            >
                <div style={{margin: '20px 60px'}}>
                    <Button 
                        type="primary"
                        style={{ width: '120px', margin: '0 10px 20px 10px'}}
                        onClick = { this.addActions}
                    >
                        添加操作者
                    </Button>
                    <AddActionModal
                        addModalVisible = { addModalVisible }
                        closeModal = { this.closeModal }
                        addPumpAction = { this.addPumpAction }
                    />
                    <PumpActionTable
                        isLoading = { isLoading }
                        data = { accountData } 
                        deleteAction = { this.deleteAction }
                    />
                </div>
            </Modal>
        )
    }
}

export default PumpPowerModal
