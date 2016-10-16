import * as types from '../constants/ChatConstants';

const initialState = {
    count: 5,
    newMessageText: {}
    // messages: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        // case types.RECEIVE_MESSAGE:
        //     return {
        //         ...state,
        //         messages: [action.state, ...state.messages]
        //     };
        case types.UPDATE_NEW_MESSAGE:
            state.newMessageText[action.state.groupId] = action.state.message;
            return { ...state };
        case types.CLEAR_NEW_MESSAGE:
            state.newMessageText[action.state.groupId] = '';
            return { ...state };
        // case types.CLEAR_MESSAGES:
        //     return {
        //         ...state,
        //         messages: []
        //     };
        default:
            return state;
    }
}
