import * as constants from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    equipmentInfo: []
});



export default (state = defaultState, action) => {

    switch(action.type) {
        // case constants.STORE_SENSOR_TYPE:
        //     return state.merge({
        //         sensorTypes: fromJS(action.sensorTypes),
        //         usingSensorTypes: fromJS(action.usingSensorTypes)
        //     })
        default:
            return state;
    }
    
}