import * as constants from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    sensorTypes: [],  
});



export default (state = defaultState, action) => {

    switch(action.type) {
        case constants.STORE_SENSOR_TYPE:
            return state.set('sensorTypes', fromJS(action.sensorTypes));
        default:
            return state;
    }   
}