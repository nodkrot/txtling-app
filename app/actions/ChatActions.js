import { AsyncStorage, PushNotificationIOS } from 'react-native';
import { BASE_URL } from '../constants/AppConstants';
import * as types from '../constants/ChatConstants';

export function updateNewMessage(groupId, message) {
    return { type: types.UPDATE_NEW_MESSAGE, state: { groupId, message } };
}

export function clearNewMessage(groupId) {
    return { type: types.CLEAR_NEW_MESSAGE, state: { groupId } };
}

function requestClearChatBadges() {
    return { type: types.REQUEST_CLEAR_CHAT_BADGES };
}

function receiveClearChatBadges(state) {
    return { type: types.RECEIVE_CLEAR_CHAT_BADGES, state };
}

export function clearChatBadges(groupId) {
    return (dispatch) => {
        dispatch(requestClearChatBadges());

        return AsyncStorage.getItem('AUTH_TOKEN').then((value) => {
            return fetch(`${BASE_URL}chats/clear-badges`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${value}`
                },
                body: JSON.stringify({ group_id: groupId })
            });
        })
        .then((response) => response.json())
        .then((res) => {
            const totalBadges = res.data.reduce((acc, group) => acc + group.badges, 0);

            dispatch(receiveClearChatBadges(res.data));
            PushNotificationIOS.setApplicationIconBadgeNumber(totalBadges);
        })
        .catch((err) => console.log(err)); // eslint-disable-line
    }
}

// export function receiveMessage(message) {
//     return { type: types.RECEIVE_MESSAGE, state: message };
// }

// export function clearMessages() {
//     return { type: types.CLEAR_MESSAGES };
// }
