import { BASE_URL } from '../constants/AppConstants';

export const GET_LANGUAGES = 'GET_LANGUAGES';

export const getLanguages = () => ({
    type: GET_LANGUAGES,
    payload: fetch(`${BASE_URL}languages`)
        .then((response) => response.json())
        .then((res) => res.data)
        .catch((err) => console.log(err)) // eslint-disable-line
});

const initialState = {
    allLanguages: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case `${GET_LANGUAGES}_FULFILLED`:
            return {
                ...state,
                allLanguages: action.payload
            };

        default:
            return state;
    }
}
