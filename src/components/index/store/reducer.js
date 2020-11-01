import * as constants from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    sensorTypes: [],  
    roleData: [],
    usingSensorTypes: [],
});



export default (state = defaultState, action) => {

    switch(action.type) {
        case constants.STORE_SENSOR_TYPE:
            return state.merge({
                sensorTypes: fromJS(action.sensorTypes),
                usingSensorTypes: fromJS(action.usingSensorTypes)
            })
        
        case constants.STORE_ROLE_DATA:
            return state.set('roleData', fromJS(action.roleData));
        default:
            return state;
    }
    
}