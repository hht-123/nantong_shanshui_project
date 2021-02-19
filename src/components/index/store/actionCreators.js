import * as constants from './constants';
import { Model } from '../../../dataModule/testBone';
import { message } from 'antd';
import { sensorTypeUrl, verifyUrl, device, getEquipmentPumsUrl } from '../../../dataModule/UrlList';
import {getUserId, getRoleId}  from '../../../publicFunction/index';

const storeSensorType = (result, usingSensorTypes) => ({
    type: constants.STORE_SENSOR_TYPE,
    sensorTypes: result,
    usingSensorTypes,
})


export const  getSensorType = () => {
    const model = new Model();
    return (dispatch) => {
        model.fetch(
            {sensor: 'all'},
            sensorTypeUrl,
            'get',
            function(response) {
                const result = response.data; 
                const usingSensorTypes = result.filter((item) => item.state === '1');
                dispatch(storeSensorType(result, usingSensorTypes));
            },
            function() {
                message.warning('发送数据失败，请重试')
            },
            false,
        )
    }
}

const storeroleData = (result) => ({
    type: constants.STORE_ROLE_DATA,
    roleData: result,
})

export const  getRoleData = () => {
    const model = new Model();
    return (dispatch) => {
        model.fetch(
            {'user_id': getUserId(), 'role_id': getRoleId()},
            verifyUrl,
            'get',
            function(response) {
                const result = response.data.power_num;
                dispatch(storeroleData(result));
            },
            function() {
                console.log('角色权限数据获取失败')
                // message.warning('角色权限数据获取失败')
            },
            false,
        )
    }
}

//获得设备对应的传感器信息
const equipmentSensor = (result) => ({
    type: constants.EQUIPMENT_SENSOR,
    equipmentSensor: result,
})

export const  getEquipmentSensor = (equipment_code) => {
    const model = new Model();
    return (dispatch) => {
        model.fetch(
            {'deviceNum': equipment_code },
            device,
            'get',
            function(response) {
                const result = response.data
                dispatch(equipmentSensor(result));
            },
            function() {
                message.warning('获取设备传感器数据失败，请重试')
            },
            false,
        )
    }
}

//获得设备对应的泵信息
const equipmentPumps = (result) => ({
    type: constants.EQUIPMENT_PUMPS,
    equipmentPumps: result,
})

export const  getEquipmentPumpsInfo = (equipment_code) => {
    const model = new Model();
    return (dispatch) => {
        model.fetch(
            {'equipment_code': equipment_code },
            getEquipmentPumsUrl,
            'get',
            function(response) {
                const result = response.data.pump_object_list
                dispatch(equipmentPumps(result));
            },
            function() {
                message.warning('获取设备对应泵数据失败，请重试')
            },
            false,
        )
    }
}
