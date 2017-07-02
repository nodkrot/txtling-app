import Firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import * as types from '../constants/LoginConstants';
import { BASE_URL } from '../constants/AppConstants';

const firebaseRef = new Firebase('https://txtling.firebaseio.com');

function requestIsLoggedIn() {
    return { type: types.REQUEST_IS_LOGGED_IN };
}

function receiveIsLoggedIn(state) {
    return { type: types.RECEIVE_IS_LOGGED_IN, state };
}

export function isLoggedIn() {
    return (dispatch) => {
        dispatch(requestIsLoggedIn());

        return Promise.all([
            AsyncStorage.getItem('AUTH_TOKEN'),
            AsyncStorage.getItem('USER_INFO'),
            AsyncStorage.getItem('FIRE_TOKEN'),
        ]).then(([ authToken, userInfoJson, fireToken ]) => {
            const hasToken = Boolean(authToken) && Boolean(fireToken);
            const userInfo = userInfoJson ? JSON.parse(userInfoJson) : {};

            if (hasToken) {
                firebaseRef.authWithCustomToken(fireToken);
            }

            dispatch(receiveIsLoggedIn({ hasToken, userInfo }));
        });
    }
}

function requestGenerateCode() {
    return { type: types.REQUEST_GENERATE_CODE };
}

function receiveGenerateCode(state) {
    return { type: types.RECEIVE_GENERATE_CODE, state };
}

export function generateCode(data) {
    return (dispatch) => {
        dispatch(requestGenerateCode());

        return fetch(`${BASE_URL}phone/generate`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((res) => {
            AsyncStorage.setItem('USER_INFO', JSON.stringify(res.data));
            dispatch(receiveGenerateCode(res.data));
        });
    };
}

function requestCodeConfirm() {
    return { type: types.REQUEST_CODE_CONFIRM };
}

function receiveCodeConfirm(state) {
    return { type: types.RECEIVE_CODE_CONFIRM, state };
}

export function confirmCode(username, password) {
    return (dispatch) => {
        dispatch(requestCodeConfirm());
        return fetch(`${BASE_URL}phone/confirm`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then((response) => response.json())
        .then((res) => {
            AsyncStorage.setItem('AUTH_TOKEN', res.data.tokens.auth);
            AsyncStorage.setItem('FIRE_TOKEN', res.data.tokens.fire);
            AsyncStorage.setItem('USER_INFO', JSON.stringify(res.data));

            firebaseRef.authWithCustomToken(res.data.tokens.fire);

            dispatch(receiveCodeConfirm(res.data));
        });
    };
}

function requestRegisterDeviceToken() {
    return { type: types.REQUEST_REGISTER_DEVICE_TOKEN };
}

function receiveRegisterDeviceToken(state) {
    return { type: types.RECEIVE_REGISTER_DEVICE_TOKEN, state };
}

export function registerDeviceToken(data) {
    return (dispatch) => {
        dispatch(requestRegisterDeviceToken());

        return AsyncStorage.getItem('AUTH_TOKEN')
            .then((value) => fetch(`${BASE_URL}phone/device-token`, {
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
            AsyncStorage.setItem('USER_INFO', JSON.stringify(res.data));
            dispatch(receiveRegisterDeviceToken(res.data));
        });
    };
}

function requestRegisterUser() {
    return { type: types.REQUEST_REGISTER_USER };
}

function receiveRegisterUser(state) {
    return { type: types.RECEIVE_REGISTER_USER, state };
}

export function registerUser(data) {
    return (dispatch) => {
        dispatch(requestRegisterUser());

        return AsyncStorage.getItem('AUTH_TOKEN')
            .then((value) => fetch(`${BASE_URL}phone/register`, {
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
                AsyncStorage.setItem('USER_INFO', JSON.stringify(res.data));
                dispatch(receiveRegisterUser(res.data));
            });
    };
}

function requestRegisterLanguage() {
    return { type: types.REQUEST_REGISTER_LANGUAGE };
}

function receiveRegisterLanguage(state) {
    return { type: types.RECEIVE_REGISTER_LANGUAGE, state };
}

export function registerLanguage(data) {
    return (dispatch) => {
        dispatch(requestRegisterLanguage());

        return AsyncStorage.getItem('AUTH_TOKEN')
            .then((value) => fetch(`${BASE_URL}phone/language`, {
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
                AsyncStorage.setItem('USER_INFO', JSON.stringify(res.data));
                dispatch(receiveRegisterLanguage(res.data));
            });
    };
}

function requestUploadImage() {
    return { type: types.REQUEST_UPLOAD_IMAGE };
}

function receiveUploadImage(state) {
    return { type: types.RECEIVE_UPLOAD_IMAGE, state };
}

export function uploadImage(image) {
    const formData = new FormData();
    formData.append('type', 'file');
    formData.append('profile', image);

    return (dispatch) => {
        dispatch(requestUploadImage());

        return AsyncStorage.getItem('AUTH_TOKEN')
            .then((value) => fetch(`${BASE_URL}phone/image/upload`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${value}`
                },
                body: formData
            }))
            .then((response) => response.json())
            .then((res) => {
                AsyncStorage.setItem('USER_INFO', JSON.stringify(res.data));
                dispatch(receiveUploadImage(res.data));
            });
    };
}

export function logout() {
    return (dispatch) => {
        firebaseRef.unauth();
        AsyncStorage.clear();
        dispatch({ type: types.LOGOUT });
    };
}
