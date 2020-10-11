import * as constants from './constants';

const defaultState = {
    sensorTypes: [],  
};



export default (state = defaultState, action) => {

    switch(action.type) {
        case constants.STORE_SENSOR_TYPE:
            const newState = JSON.parse(JSON.stringify(state));
            newState.sensorTypes = action.sensorTypes;
            return newState;
        default:
            return state;
    }   
}