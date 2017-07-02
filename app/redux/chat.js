// import { AsyncStorage } from 'react-native';
// import { BASE_URL } from '../constants/AppConstants';

const UPDATE_NEW_MESSAGE = 'UPDATE_NEW_MESSAGE';
const CLEAR_NEW_MESSAGE = 'CLEAR_NEW_MESSAGE';
// const REQUEST_UPDATE_SETTINGS = 'REQUEST_UPDATE_SETTINGS';
// const RECEIVE_UPDATE_SETTINGS = 'RECEIVE_UPDATE_SETTINGS';

export function updateNewMessage(groupId, message) {
    return { type: UPDATE_NEW_MESSAGE, state: { groupId, message } };
}

export function clearNewMessage(groupId) {
    return { type: CLEAR_NEW_MESSAGE, state: { groupId } };
}

// function requestUpdateSettings() {
//     return { type: REQUEST_UPDATE_SETTINGS };
// }

// function receiveUpdateSettings(state) {
//     return { type: RECEIVE_UPDATE_SETTINGS, state };
// }

// export function updateSettings(data) {
//     return (dispatch) => {
//         dispatch(requestUpdateSettings());

//         return AsyncStorage.getItem('AUTH_TOKEN')
//             .then((value) => fetch(`${BASE_URL}chats/settings`, {
//                 method: 'post',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `JWT ${value}`
//                 },
//                 body: JSON.stringify(data)
//             }))
//         .then((response) => response.json())
//         .then((res) => {
//             dispatch(receiveUpdateSettings(res.data));
//         });
//     };
// }

const initialState = {
    newMessageText: {}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_NEW_MESSAGE:
            state.newMessageText[action.state.groupId] = action.state.message;
            return { ...state };
        case CLEAR_NEW_MESSAGE:
            state.newMessageText[action.state.groupId] = '';
            return { ...state };
        default:
            return state;
    }
}

