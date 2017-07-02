import * as types from '../constants/LoginConstants';

const initialState = { /* user object */ };

export default function (state = initialState, action) {

    switch (action.type) {

        case types.RECEIVE_IS_LOGGED_IN:
            return {
                ...state,
                ...action.state.userInfo
            };

        case types.RECEIVE_GENERATE_CODE:
        case types.RECEIVE_CODE_CONFIRM:
        case types.RECEIVE_REGISTER_DEVICE_TOKEN:
        case types.RECEIVE_REGISTER_USER:
        case types.RECEIVE_REGISTER_LANGUAGE:
        case types.RECEIVE_UPLOAD_IMAGE:
            return {
                ...state,
                ...action.state
            };

        case types.RECEIVE_GET_LANGUAGES:
            return {
                ...state,
                languages: action.state
            };

        default:
            return state;
    }
}
