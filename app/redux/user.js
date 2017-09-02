import { AsyncStorage } from 'react-native';
import Tracker from '../utilities/tracker';
import { BASE_URL } from '../constants/AppConstants';
import firebaseRef from '../firebase/database';

export const IS_LOGGED_IN = 'IS_LOGGED_IN';
export const GENERATE_CODE = 'GENERATE_CODE';
export const CODE_CONFIRM = 'CODE_CONFIRM';
export const REGISTER_DEVICE_TOKEN = 'REGISTER_DEVICE_TOKEN';
export const REGISTER_USER = 'REGISTER_USER';
export const REGISTER_LANGUAGE = 'REGISTER_LANGUAGE';
export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const LOGOUT = 'LOGOUT';

export const isLoggedIn = () => ({
    type: IS_LOGGED_IN,
    payload: Promise.all([
        AsyncStorage.getItem('USER_INFO'),
        AsyncStorage.getItem('AUTH_TOKEN'),
        AsyncStorage.getItem('FIRE_TOKEN')
    ]).then(([userInfoJson, authToken, fireToken]) => {
        const hasToken = Boolean(authToken) && Boolean(fireToken);
        const userInfo = userInfoJson ? JSON.parse(userInfoJson) : {};

        if (hasToken) {
            firebaseRef.authWithCustomToken(fireToken);

            const presenceRef = firebaseRef.child('presence').child(userInfo._id);
            presenceRef.onDisconnect().remove();
            presenceRef.set(true);

            Tracker.setUser(userInfo._id);
        }

        return { hasToken, userInfo };
    })
});

export const generateCode = (data) => ({
    type: GENERATE_CODE,
    payload: fetch(`${BASE_URL}phone/generate`, {
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
            return res.data;
        })
});

export const confirmCode = (username, password) => ({
    type: CODE_CONFIRM,
    payload: fetch(`${BASE_URL}phone/confirm`, {
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

            const presenceRef = firebaseRef.child('presence').child(res.data._id);
            presenceRef.onDisconnect().remove();
            presenceRef.set(true);

            return res.data;
        })
});

export const registerDeviceToken = (data) => ({
    type: REGISTER_DEVICE_TOKEN,
    payload: AsyncStorage.getItem('AUTH_TOKEN')
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
            return res.data;
        })
});

export const registerUser = (data) => ({
    type: REGISTER_USER,
    payload: AsyncStorage.getItem('AUTH_TOKEN')
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
            return res.data;
        })
});

export const registerLanguage = (data) => ({
    type: REGISTER_LANGUAGE,
    payload: AsyncStorage.getItem('AUTH_TOKEN')
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
            return res.data;
        })
});

export const uploadImage = (image) => {
    const formData = new FormData();
    formData.append('type', 'file');
    formData.append('profile', image);

    return {
        type: UPLOAD_IMAGE,
        payload: AsyncStorage.getItem('AUTH_TOKEN')
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
                return res.data;
            })
    };
};

export const logout = (userId) => {
    firebaseRef.child('presence').child(userId).remove();
    firebaseRef.unauth();
    AsyncStorage.clear();
    return { type: LOGOUT };
};

const initialState = {
    isUserLoggedIn: false,
    isUserFetched: false
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case `${IS_LOGGED_IN}_FULFILLED`:
            return {
                ...state,
                ...action.payload.userInfo,
                isUserLoggedIn: action.payload.hasToken,
                isUserFetched: true
            };

        case `${CODE_CONFIRM}_FULFILLED`:
            return {
                ...state,
                ...action.payload,
                isUserLoggedIn: true
            };

        case `${GENERATE_CODE}_FULFILLED`:
        case `${REGISTER_DEVICE_TOKEN}_FULFILLED`:
        case `${REGISTER_USER}_FULFILLED`:
        case `${REGISTER_LANGUAGE}_FULFILLED`:
        case `${UPLOAD_IMAGE}_FULFILLED`:
            return {
                ...state,
                ...action.payload
            };

        case LOGOUT:
            return {
                isUserLoggedIn: false,
                isUserFetched: true
            };

        default:
            return state;
    }
}
