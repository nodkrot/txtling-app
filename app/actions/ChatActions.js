import * as types from '../constants/ChatConstants';

export function updateNewMessage(groupId, message) {
    return { type: types.UPDATE_NEW_MESSAGE, state: { groupId, message } };
}

export function clearNewMessage(groupId) {
    return { type: types.CLEAR_NEW_MESSAGE, state: { groupId } };
}

// export function receiveMessage(message) {
//     return { type: types.RECEIVE_MESSAGE, state: message };
// }

// export function clearMessages() {
//     return { type: types.CLEAR_MESSAGES };
// }
