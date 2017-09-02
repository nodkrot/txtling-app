import * as chatActions from './chat';
import * as contactsActions from './contacts';
import * as languageActions from './languages';

const initialState = {
    isScreenLoading: false,
    asyncStates: {}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case `${contactsActions.GET_CONTACTS}_PENDING`:
        case `${contactsActions.CREATE_CONTACTS}_PENDING`:
        case `${chatActions.GET_CHATS}_PENDING`:
        case `${chatActions.CREATE_CHAT}_PENDING`:
        case `${languageActions.GET_LANGUAGES}_PENDING`:
            return {
                ...state,
                isScreenLoading: true
            };

        case `${contactsActions.GET_CONTACTS}_FULFILLED`:
        case `${contactsActions.CREATE_CONTACTS}_FULFILLED`:
        case `${chatActions.GET_CHATS}_FULFILLED`:
        case `${chatActions.CREATE_CHAT}_FULFILLED`:
        case `${languageActions.GET_LANGUAGES}_FULFILLED`:
        case `${contactsActions.GET_CONTACTS}_REJECTED`:
        case `${contactsActions.CREATE_CONTACTS}_REJECTED`:
        case `${chatActions.GET_CHATS}_REJECTED`:
        case `${chatActions.CREATE_CHAT}_REJECTED`:
        case `${languageActions.GET_LANGUAGES}_REJECTED`:
            return {
                ...state,
                isScreenLoading: false
            };

        case 'ASYNC_STATE_TRACKER':
            return { ...state, asyncStates: { ...action.payload } };

        default:
            return state;
    }
}
