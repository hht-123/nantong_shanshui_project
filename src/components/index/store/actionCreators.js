import * as constants from './constants';
import { Model } from '../../../dataModule/testBone';
import { message } from 'antd';
import { sensorTypeUrl } from '../../../dataModule/UrlList';

const storeSensorType = (result) => ({
    type: constants.STORE_SENSOR_TYPE,
    sensorTypes: result,
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
                dispatch(storeSensorType(result));
            },
            function() {
                message.warning('发送数据失败，请重试')
            },
            false,
        )
    }
}