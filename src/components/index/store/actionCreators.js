import * as constants from './constants';
import { Model } from '../../../dataModule/testBone';
import { message } from 'antd';
import { sensorTypeUrl, verifyUrl } from '../../../dataModule/UrlList';
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