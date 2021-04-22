import * as constants from './constants'
import { fromJS } from 'immutable';

const defaultState = fromJS({
    equipmentInfo: [],
    inputDisabled: false
});



export default (state = defaultState, action) => {

    switch(action.type) {
        case constants.CHANGE_INPUT_DISABLED:
            const newState = JSON.parse(JSON.stringify(state));
            newState.inputDisabled = action.disabled;
            return newState
        default:
            return state;
    }
    
}