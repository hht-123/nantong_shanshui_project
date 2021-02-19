import * as constants from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    sensorTypes: [],  
    roleData: [],
    usingSensorTypes: [],
    equipmentSensor: [],
    equipmentPumps:[]
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
        case constants.EQUIPMENT_SENSOR:
            return state.set('equipmentSensor', fromJS(action.equipmentSensor))
        case constants.EQUIPMENT_PUMPS:
            return state.set('equipmentPumps', fromJS(action.equipmentPumps))
        default:
            return state;
    }
    
}