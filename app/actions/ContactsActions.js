import { AsyncStorage, PushNotificationIOS } from 'react-native';
import Contacts from 'react-native-contacts';
import * as types from '../constants/ContactsConstants';
import { BASE_URL } from '../constants/AppConstants';

function requestCreateContacts() {
    return { type: types.REQUEST_CREATE_CONTACTS };
}

function receiveCreateContacts(state) {
    return { type: types.RECEIVE_CREATE_CONTACTS, state };
}

function failureCreateContacts() {
    return { type: types.FAILURE_CREATE_CONTACTS };
}

export function createContacts() {
    return (dispatch, getState) => {
        dispatch(requestCreateContacts());

        return dispatch(getPhoneContacts()).then(() => {
            return AsyncStorage.getItem('AUTH_TOKEN');
        })
        .then((value) => {
            const { phoneContacts } = getState().Contacts;

            return fetch(`${BASE_URL}contacts`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${value}`
                },
                body: JSON.stringify({ contacts: phoneContacts })
            })
        })
        .then((response) => response.json())
        .then((res) => dispatch(receiveCreateContacts(res.data)))
        .catch(() => dispatch(failureCreateContacts()));
    }
}

function requestGetContacts() {
    return { type: types.REQUEST_GET_CONTACTS };
}

function receiveGetContacts(state) {
    return { type: types.RECEIVE_GET_CONTACTS, state };
}

function failureGetContacts() {
    return { type: types.FAILURE_GET_CONTACTS };
}

export function getContacts() {
    return (dispatch) => {
        dispatch(requestGetContacts());

        return AsyncStorage.getItem('AUTH_TOKEN').then((value) => {
            return fetch(`${BASE_URL}contacts`, {
                headers: {
                    Authorization: `Basic ${value}`
                }
            });
        })
        .then((response) => response.json())
        .then((res) => dispatch(receiveGetContacts(res.data)))
        .catch(() => dispatch(failureGetContacts()));
    }
}

function requestGetPhoneContacts() {
    return { type: types.REQUEST_GET_PHONE_CONTACTS };
}

function receiveGetPhoneContacts(state) {
    return { type: types.RECEIVE_GET_PHONE_CONTACTS, state };
}

export function getPhoneContacts() {
    return (dispatch, getState) => {
        const { phoneContacts } = getState().Contacts;

        if (!phoneContacts.length) {
            dispatch(requestGetPhoneContacts());

            return new Promise((resolve, reject) => {
                Contacts.getAll((err, addressBook) => {
                    if (err && err.type === 'permissionDenied') {
                        reject(err);
                    } else {
                        dispatch(receiveGetPhoneContacts(addressBook));
                        resolve();
                    }
                });
            });
        } else {
            return Promise.resolve();
        }
    }
}

function requestGetChats() {
    return { type: types.REQUEST_GET_CHATS };
}

function receiveGetChats(state) {
    return { type: types.RECEIVE_GET_CHATS, state };
}

function failureGetChats() {
    return { type: types.FAILURE_GET_CHATS };
}

export function getChats() {
    return (dispatch) => {
        dispatch(requestGetChats());

        return AsyncStorage.getItem('AUTH_TOKEN').then((value) => {
            return fetch(`${BASE_URL}chats`, {
                headers: {
                    Authorization: `Basic ${value}`
                }
            });
        })
        .then((response) => response.json())
        .then((res) => dispatch(receiveGetChats(res.data)))
        .catch(() => dispatch(failureGetChats()));
    }
}

function requestCreateChat() {
    return { type: types.REQUEST_CREATE_CHAT };
}

function receiveCreateChat(state) {
    return { type: types.RECEIVE_CREATE_CHAT, state };
}

export function createChat(payload) {
    return (dispatch) => {
        dispatch(requestCreateChat());

        return AsyncStorage.getItem('AUTH_TOKEN').then((value) => {
            return fetch(`${BASE_URL}chats`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${value}`
                },
                body: JSON.stringify(payload)
            });
        })
        .then((response) => response.json())
        .then((res) => {
            dispatch(receiveCreateChat(res.data));
            return res.data;
        });
        // .catch((err) => console.log(err)); // eslint-disable-line
    }
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
            dispatch(receiveClearChatBadges(res.data));

            const totalBadges = res.data.reduce((acc, group) => acc + group.badges, 0);
            PushNotificationIOS.setApplicationIconBadgeNumber(totalBadges);
        });
        // .catch((err) => console.log(err)); // eslint-disable-line
    }
}

export function toggleRow(id) {
    return { type: types.TOGGLE_SELECT_ROW, state: id };
}

export function resetPhoneContacts() {
    return { type: types.RESET_PHONE_CONTACTS };
}
