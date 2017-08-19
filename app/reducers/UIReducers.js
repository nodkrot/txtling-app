import * as LoginTypes from '../constants/LoginConstants';
import * as ContactTypes from '../constants/ContactsConstants';
import { REQUEST_GET_CHATS, RECEIVE_GET_CHATS, FAILURE_GET_CHATS } from '../redux/chat.js';
import { REQUEST_GET_LANGUAGES, RECEIVE_GET_LANGUAGES, FAILURE_GET_LANGUAGES } from '../redux/languages.js';

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

        case LoginTypes.LOGOUT:
            return {
                ...state,
                isUserLoggedIn: false
            };

        case ContactTypes.REQUEST_GET_CONTACTS:
        case ContactTypes.REQUEST_CREATE_CONTACTS:
        case REQUEST_GET_CHATS:
        case REQUEST_GET_LANGUAGES:
            return {
                ...state,
                isScreenLoading: true
            };

        case ContactTypes.RECEIVE_GET_CONTACTS:
        case ContactTypes.RECEIVE_CREATE_CONTACTS:
        case RECEIVE_GET_CHATS:
        case RECEIVE_GET_LANGUAGES:
        case ContactTypes.FAILURE_GET_CONTACTS:
        case ContactTypes.FAILURE_CREATE_CONTACTS:
        case FAILURE_GET_CHATS:
        case FAILURE_GET_LANGUAGES:
            return {
                ...state,
                isScreenLoading: false
            };

        default:
            return state;
    }
}
