import { BASE_URL } from '../constants/AppConstants';

export const REQUEST_GET_LANGUAGES = 'REQUEST_GET_LANGUAGES';
export const RECEIVE_GET_LANGUAGES = 'RECEIVE_GET_LANGUAGES';
export const FAILURE_GET_LANGUAGES = 'FAILURE_GET_LANGUAGES';

function requestGetLanguages() {
    return { type: REQUEST_GET_LANGUAGES };
}

function receiveGetLanguages(payload) {
    return { type: RECEIVE_GET_LANGUAGES, payload };
}

function failureGetLanguages() {
    return { type: FAILURE_GET_LANGUAGES };
}

export function getLanguages() {
    return (dispatch) => {
        dispatch(requestGetLanguages());

        return fetch(`${BASE_URL}languages`)
            .then((response) => response.json())
            .then((res) => dispatch(receiveGetLanguages(res.data)))
            .catch(() => dispatch(failureGetLanguages()));
    };
}

const initialState = {
    allLanguages: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case RECEIVE_GET_LANGUAGES:
            return {
                ...state,
                allLanguages: action.payload
            };

        default:
            return state;
    }
}
