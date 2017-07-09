import { BASE_URL } from '../constants/AppConstants';

const REQUEST_GET_LANGUAGES = 'REQUEST_GET_LANGUAGES';
const RECEIVE_GET_LANGUAGES = 'RECEIVE_GET_LANGUAGES';

function requestGetLanguages() {
    return { type: REQUEST_GET_LANGUAGES };
}

function receiveGetLanguages(state) {
    return { type: RECEIVE_GET_LANGUAGES, state };
}

export function getLanguages() {
    return (dispatch) => {
        dispatch(requestGetLanguages());

        return fetch(`${BASE_URL}languages`)
            .then((response) => response.json())
            .then((res) => dispatch(receiveGetLanguages(res.data)))
            .catch((err) => console.log(err)); // eslint-disable-line
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
                allLanguages: action.state
            };

        default:
            return state;
    }
}
