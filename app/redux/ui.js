import * as userActions from './user.js';
import * as chatActions from './chat.js';
import * as contactsActions from './contacts.js';
import * as languageActions from './languages.js';

const initialState = {
    isUserFetched: false,
    isUserLoggedIn: false,
    isScreenLoading: false,
    asyncStates: {}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case `${userActions.IS_LOGGED_IN}_FULFILLED`:
            return {
                ...state,
                isUserLoggedIn: action.payload.hasToken,
                isUserFetched: true
            };
        case `${userActions.CODE_CONFIRM}_FULFILLED`:
            return {
                ...state,
                isUserLoggedIn: true
            };

        case userActions.LOGOUT:
            return {
                ...state,
                isUserLoggedIn: false
            };

        case `${contactsActions.GET_CONTACTS}_PENDING`:
        case `${contactsActions.CREATE_CONTACTS}_PENDING`:
        case `${chatActions.GET_CHATS}_PENDING`:
        case `${languageActions.GET_LANGUAGES}_PENDING`:
            return {
                ...state,
                isScreenLoading: true
            };

        case `${contactsActions.GET_CONTACTS}_FULFILLED`:
        case `${contactsActions.CREATE_CONTACTS}_FULFILLED`:
        case `${chatActions.GET_CHATS}_FULFILLED`:
        case `${languageActions.GET_LANGUAGES}_FULFILLED`:
        case `${contactsActions.GET_CONTACTS}_REJECTED`:
        case `${contactsActions.CREATE_CONTACTS}_REJECTED`:
        case `${chatActions.GET_CHATS}_REJECTED`:
        case `${languageActions.GET_LANGUAGES}_REJECTED`:
            return {
                ...state,
                isScreenLoading: false
            };

        case 'ASYNC_STATE_TRACKER':
            return { ...state, asyncStates: { ...action.payload } }

        default:
            return state;
    }
}
