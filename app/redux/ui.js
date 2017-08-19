import { IS_LOGGED_IN, CODE_CONFIRM, LOGOUT } from './user.js';

const initialState = {
    isUserFetched: false,
    isUserLoggedIn: false,
    asyncStates: {}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case `${IS_LOGGED_IN}_FULFILLED`:
            return {
                ...state,
                isUserLoggedIn: action.payload.hasToken,
                isUserFetched: true
            };
        case `${CODE_CONFIRM}_FULFILLED`:
            return {
                ...state,
                isUserLoggedIn: true
            };

        case LOGOUT:
            return {
                ...state,
                isUserLoggedIn: false
            };
        case 'ASYNC_STATE_TRACKER':
            return { ...state, asyncStates: { ...action.payload } }
        default:
            return state;
    }
}
