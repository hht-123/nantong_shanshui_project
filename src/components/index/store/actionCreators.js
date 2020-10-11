import * as constants from './constants';
import { sensorTypeUrl } from '../../../dataModule/UrlList';
import { Model } from '../../../dataModule/testBone';
import { message } from 'antd';

const storeSensorType = (result) => ({
    type: constants.STORE_SENSOR_TYPE,
    sensorTypes: result,
})

export const  getSensorType = () => {
    const model = new Model();
    return (dispatch) => {
        model.fetch(
            {type_name: 'PH传感器'},
            'app/sensor_type_to_model/',
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