import { AsyncStorage, PushNotificationIOS } from 'react-native';
import { BASE_URL } from '../constants/AppConstants';

const UPDATE_NEW_MESSAGE = 'UPDATE_NEW_MESSAGE';
const CLEAR_NEW_MESSAGE = 'CLEAR_NEW_MESSAGE';
const REQUEST_GET_CHATS = 'REQUEST_GET_CHATS';
const RECEIVE_GET_CHATS = 'RECEIVE_GET_CHATS';
const FAILURE_GET_CHATS = 'FAILURE_GET_CHATS';
const REQUEST_CREATE_CHAT = 'REQUEST_CREATE_CHATS';
const RECEIVE_CREATE_CHAT = 'RECEIVE_CREATE_CHATS';
const REQUEST_UPDATE_SETTINGS = 'REQUEST_UPDATE_SETTINGS';
const RECEIVE_UPDATE_SETTINGS = 'RECEIVE_UPDATE_SETTINGS';
const REQUEST_CLEAR_CHAT_BADGES = 'REQUEST_CLEAR_CHAT_BADGES';
const RECEIVE_CLEAR_CHAT_BADGES = 'RECEIVE_CLEAR_CHAT_BADGES';
const SET_GLOBAL_BADGE_NUMBER = 'SET_GLOBAL_BADGE_NUMBER';

export function updateNewMessage(groupId, message) {
    return { type: UPDATE_NEW_MESSAGE, state: { groupId, message } };
}

export function clearNewMessage(groupId) {
    return { type: CLEAR_NEW_MESSAGE, state: { groupId } };
}

function requestGetChats() {
    return { type: REQUEST_GET_CHATS };
}

function receiveGetChats(state) {
    return { type: RECEIVE_GET_CHATS, state };
}

function failureGetChats() {
    return { type: FAILURE_GET_CHATS };
}

export function getChats() {
    return (dispatch) => {
        dispatch(requestGetChats());

        return AsyncStorage.getItem('AUTH_TOKEN').then((value) => {
            return fetch(`${BASE_URL}chats`, {
                headers: {
                    Authorization: `JWT ${value}`
                }
            });
        })
        .then((response) => response.json())
        .then((res) => {
            dispatch(receiveGetChats(res.data));
            return res.data;
        })
        .catch(() => dispatch(failureGetChats()));
    }
}

function requestCreateChat() {
    return { type: REQUEST_CREATE_CHAT };
}

function receiveCreateChat(state) {
    return { type: RECEIVE_CREATE_CHAT, state };
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
                    'Authorization': `JWT ${value}`
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

function requestUpdateSettings() {
    return { type: REQUEST_UPDATE_SETTINGS };
}

function receiveUpdateSettings(state) {
    return { type: RECEIVE_UPDATE_SETTINGS, state };
}

export function updateSettings(data) {
    return (dispatch) => {
        dispatch(requestUpdateSettings());

        return AsyncStorage.getItem('AUTH_TOKEN')
            .then((value) => fetch(`${BASE_URL}chats/settings`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${value}`
                },
                body: JSON.stringify(data)
            }))
        .then((response) => response.json())
        .then((res) => {
            dispatch(receiveUpdateSettings(res.data));
        });
    };
}

function requestClearChatBadges() {
    return { type: REQUEST_CLEAR_CHAT_BADGES };
}

function receiveClearChatBadges(state) {
    return { type: RECEIVE_CLEAR_CHAT_BADGES, state };
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
                    'Authorization': `JWT ${value}`
                },
                body: JSON.stringify({ group_id: groupId })
            });
        })
        .then((response) => response.json())
        .then((res) => {
            const totalBadges = res.data.reduce((acc, group) => acc + group.badges, 0);

            dispatch(receiveClearChatBadges(res.data));
            dispatch(setGlobalBadgeNumber(totalBadges));
            PushNotificationIOS.setApplicationIconBadgeNumber(totalBadges);
        })
        .catch((err) => console.log(err)); // eslint-disable-line
    }
}

export function setGlobalBadgeNumber(number) {
    return { type: SET_GLOBAL_BADGE_NUMBER, state: number };
}

function compareChats(a, b) {
    if (a.badges < b.badges)
        return 1;
    if (a.badges > b.badges)
        return -1;
    return 0;
}

const initialState = {
    newMessageText: {},
    allChats: [],
    chatBadgeNumber: 0
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_NEW_MESSAGE:
            state.newMessageText[action.state.groupId] = action.state.message;
            return { ...state };
        case CLEAR_NEW_MESSAGE:
            state.newMessageText[action.state.groupId] = '';
            return { ...state };
        case RECEIVE_GET_CHATS:
        case RECEIVE_CLEAR_CHAT_BADGES:
            return { ...state, allChats: action.state.sort(compareChats) };
        case SET_GLOBAL_BADGE_NUMBER:
            return { ...state, chatBadgeNumber: action.state };
        case RECEIVE_CREATE_CHAT:
            return { ...state, allChats: [...action.state, ...state.allChats] };
        // case RECEIVE_UPDATE_SETTINGS:
        //     return {
        //         ...state
        //     }
        default:
            return state;
    }
}

