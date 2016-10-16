import * as LoginTypes from '../constants/LoginConstants';
import * as ContactTypes from '../constants/ContactsConstants';

const initialState = {
    isUserLoggedIn: false,
    isFetchingUser: false,
    isScreenLoading: false
};

export default function (state = initialState, action) {

    switch (action.type) {
        case LoginTypes.REQUEST_IS_LOGGED_IN:
            return {
                ...state,
                isFetchingUser: true
            };

        case LoginTypes.RECEIVE_IS_LOGGED_IN:
            return {
                ...state,
                isUserLoggedIn: action.state.hasToken,
                isFetchingUser: false
            };

        case LoginTypes.RECEIVE_CODE_CONFIRM:
            return {
                ...state,
                isUserLoggedIn: true
            };

        case LoginTypes.RECEIVE_LOGOUT:
            return {
                ...state,
                isUserLoggedIn: false
            };

        case ContactTypes.REQUEST_GET_CONTACTS:
        case ContactTypes.REQUEST_CREATE_CONTACTS:
        case ContactTypes.REQUEST_GET_CHATS:
            return {
                ...state,
                isScreenLoading: true
            };

        case ContactTypes.RECEIVE_GET_CONTACTS:
        case ContactTypes.RECEIVE_CREATE_CONTACTS:
        case ContactTypes.RECEIVE_GET_CHATS:
        case ContactTypes.FAILURE_GET_CONTACTS:
        case ContactTypes.FAILURE_CREATE_CONTACTS:
        case ContactTypes.FAILURE_GET_CHATS:
            return {
                ...state,
                isScreenLoading: false
            };

        default:
            return state;
    }
}
