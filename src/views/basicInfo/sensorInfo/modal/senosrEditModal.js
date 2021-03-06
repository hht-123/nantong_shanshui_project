import React, { Component } from 'react';
import { Modal, Button, Collapse, Icon, message, Popconfirm} from 'antd';
import { Model } from '../../../../dataModule/testBone';
import { sensorModelUrl, addSensorTypeUrl, addSensorModelUrl} from '../../../../dataModule/UrlList';
import store from '../../../../store'
import { actionCreators as indexActionCreators } from '../../../../components/index/store';


const model = new Model();
const { Panel } = Collapse;
class SenosrEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            sensorModels: [],
            type_name: '',
        }
    }

    getSensorModel(params) {
        let me = this;
        model.fetch(
        params,
        sensorModelUrl,
        'get',
        function(response) {
            const sensorModels = response.data.filter(item => item.states === '1')
            me.setState({
                sensorModels
            })
        },
        function() {
            message.warning('加载失败，请重试')
        },
        false
        )
    }

    callback = (key) => {
        this.setState({sensorModels: ''});
        if(key !== undefined ){
            const type_name  = key.split(',')[1];
            this.setState({type_name});
            this.getSensorModel({type_name});
        } 
    }

    //删除传感器类型的函数
    // genExtra = (aid) => (
    //     <Popconfirm
    //         title="你确定要删除么?"
    //         onConfirm={() => this.deleteType(aid)}
    //         okText="Yes"
    //         cancelText="No"
    //     >
    //         <Icon type="delete"  style={{color: 'red'}}/>
    //     </Popconfirm>
    // )

    deleteType = (aid) => {
        if(this.state.sensorModels.length !== 0){
            message.warning("请删除当前传感器类型的型号")
            return ;
        }
        model.fetch(
        {type: "delete"},
        addSensorTypeUrl + aid + '/',
        'delete',
        function() {
            message.success("删除成功");
            store.dispatch(indexActionCreators.getSensorType())   //获取所有传感器的类型
        },
        function() {
            message.warning('删除失败');
        },
        false
        )
    }

    deleteModel = (aid) => {
        const  me = this;
        console.log(aid);
        model.fetch(
            {model: "delete"},
            addSensorModelUrl + aid + '/',
            'delete',
            function() {
                message.success("删除成功");
                me.getSensorModel({type_name: me.state.type_name});
            },
            function() {
                message.warning('删除失败');
            },
            false
        )
    }

    render() {
        const { visible, cancel, sensorTypes } = this.props;
        const { confirmLoading, sensorModels } = this.state;


        return (
            <Modal
                title="管理传感器类型和型号"
                visible={ visible }
                confirmLoading={ confirmLoading }
                destroyOnClose={ true }
                onOk={ this.handleOk }
                onCancel={ cancel }
                footer={ <Button type="primary" onClick={cancel}>关闭</Button>}
            >
                 
                    <Collapse  onChange={this.callback} accordion>
                    {
                        sensorTypes.map((item0) => (
                            <Panel header={item0.get("type_name")} key={item0.get("aid") + ',' + item0.get("type_name")} >
                                { 
                                    sensorModels.length > 0 ? sensorModels.map((item => (
                                        <div key={item.aid} style={ {marginBottom:'10px'}}>
                                            {item.sensor_model}
                                            <Popconfirm
                                                title="你确定要删除么?"
                                                onConfirm={() => this.deleteModel(item.aid)}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                 <Icon type="delete"  style={{color: 'red'}} />
                                            </Popconfirm>
                                        </div>
                                    ))) : null
                                }
                            </Panel>
                        ))
                    }
                    </Collapse>
                    
            </Modal>
        )
    }
}

export default SenosrEditModal;