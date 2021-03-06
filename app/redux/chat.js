import { AsyncStorage, PushNotificationIOS } from 'react-native';
import { LOGOUT } from './user';
import { BASE_URL } from '../constants/AppConstants';

export const UPDATE_NEW_MESSAGE = 'UPDATE_NEW_MESSAGE';
export const CLEAR_NEW_MESSAGE = 'CLEAR_NEW_MESSAGE';
export const GET_CHATS = 'GET_CHATS';
export const CREATE_CHAT = 'CREATE_CHAT';
export const UPDATE_BADGES_AND_CHATS = 'UPDATE_BADGES_AND_CHATS';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const CLEAR_CHAT_BADGES = 'CLEAR_CHAT_BADGES';
export const SET_GLOBAL_BADGE_NUMBER = 'SET_GLOBAL_BADGE_NUMBER';

export function updateNewMessage(groupId, message) {
    return { type: UPDATE_NEW_MESSAGE, payload: { groupId, message } };
}

export function clearNewMessage(groupId) {
    return { type: CLEAR_NEW_MESSAGE, payload: { groupId } };
}

export function setGlobalBadgeNumber(number) {
    return { type: SET_GLOBAL_BADGE_NUMBER, payload: number };
}

export const getChats = () => ({
    type: GET_CHATS,
    payload: AsyncStorage.getItem('AUTH_TOKEN')
        .then((value) => fetch(`${BASE_URL}chats`, {
            headers: { Authorization: `JWT ${value}` }
        }))
        .then((response) => response.json())
        .then((res) => res.data)
});

export const createChat = (payload) => ({
    type: CREATE_CHAT,
    payload: AsyncStorage.getItem('AUTH_TOKEN')
        .then((value) => fetch(`${BASE_URL}chats`, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${value}`
            },
            body: JSON.stringify(payload)
        }))
        .then((response) => response.json())
        .then((res) => res.data)
});

export const updateSettings = (data) => ({
    type: UPDATE_SETTINGS,
    payload: AsyncStorage.getItem('AUTH_TOKEN')
        .then((value) => fetch(`${BASE_URL}chats/settings`, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${value}`
            },
            body: JSON.stringify(data)
        }))
        .then((response) => response.json())
        .then((res) => res.data)
});

export const clearChatBadges = (groupId) => (dispatch) => {
    return dispatch({
        type: CLEAR_CHAT_BADGES,
        payload: AsyncStorage.getItem('AUTH_TOKEN')
            .then((value) => fetch(`${BASE_URL}chats/clear-badges`, {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${value}`
                },
                body: JSON.stringify({ group_id: groupId })
            }))
            .then((response) => response.json())
            .then((res) => {
                const totalBadges = res.data.reduce((acc, group) => acc + group.badges, 0);

                dispatch(setGlobalBadgeNumber(totalBadges));
                PushNotificationIOS.setApplicationIconBadgeNumber(totalBadges);

                return res.data;
            })
    });
};

export const updateBadgesAndChats = () => (dispatch) => {
    return dispatch({
        type: UPDATE_BADGES_AND_CHATS,
        payload: AsyncStorage.getItem('AUTH_TOKEN')
            .then((value) => fetch(`${BASE_URL}chats`, {
                headers: { Authorization: `JWT ${value}` }
            }))
            .then((response) => response.json())
            .then((res) => {
                const totalBadges = res.data.reduce((acc, group) => acc + group.badges, 0);

                dispatch(setGlobalBadgeNumber(totalBadges));
                PushNotificationIOS.setApplicationIconBadgeNumber(totalBadges);

                return res.data;
            })
    });
};

function compareChats(a, b) {
    if (a.type === 'bot') {
        return -1;
    } else if (b.type === 'bot') {
        return 1;
    } else if (a.badges > 0) {
        return -1;
    } else if (b.badges > 0) {
        return 1;
    }
    return 0;
}

const initialState = {
    newMessageText: {},
    allChats: [],
    chatBadgeNumber: 0,
    didFetchChats: false
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_NEW_MESSAGE:
            state.newMessageText[action.payload.groupId] = action.payload.message;
            return { ...state };
        case CLEAR_NEW_MESSAGE:
            state.newMessageText[action.payload.groupId] = '';
            return { ...state };
        case `${GET_CHATS}_FULFILLED`:
        case `${CLEAR_CHAT_BADGES}_FULFILLED`:
        case `${UPDATE_BADGES_AND_CHATS}_FULFILLED`:
            return {
                ...state,
                allChats: action.payload.sort(compareChats),
                didFetchChats: true
            };
        case SET_GLOBAL_BADGE_NUMBER:
            return {
                ...state,
                chatBadgeNumber: action.payload
            };
        case `${CREATE_CHAT}_FULFILLED`:
            return {
                ...state,
                allChats: [...action.payload, ...state.allChats].sort(compareChats)
            };
        case `${UPDATE_SETTINGS}_FULFILLED`:
            return {
                ...state,
                allChats: state.allChats
                    .map((chat) => (chat._id === action.payload._id ? action.payload : chat))
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}

