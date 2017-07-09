import { AsyncStorage } from 'react-native';
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
            const { phoneContacts } = getState().Contacts;

            return AsyncStorage.getItem('AUTH_TOKEN').then((value) => {
                return fetch(`${BASE_URL}contacts`, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${value}`
                    },
                    body: JSON.stringify({ contacts: phoneContacts })
                })
                .then((response) => response.json())
                .then((res) => {
                    dispatch(receiveCreateContacts(res.data))
                });
            });
        }).catch(() => dispatch(failureCreateContacts()));
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
                    Authorization: `JWT ${value}`
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

function failureGetPhoneContacts(state) {
    return { type: types.FAILURE_GET_PHONE_CONTACTS, state };
}

export function getPhoneContacts() {
    return (dispatch, getState) => {
        const { phoneContacts } = getState().Contacts;

        if (!phoneContacts.length) {
            dispatch(requestGetPhoneContacts());

            return new Promise((resolve, reject) => {
                Contacts.getAll((err, addressBook) => {
                    if (err && err.type === 'permissionDenied') {
                        dispatch(failureGetPhoneContacts(err));
                        reject(err);
                    } else {
                        dispatch(receiveGetPhoneContacts(addressBook));
                        resolve(addressBook);
                    }
                });
            });
        } else {
            // Cannot return `phoneContacts` since they are already parsed
            return Promise.resolve();
        }
    }
}

export function toggleRow(id) {
    return { type: types.TOGGLE_SELECT_ROW, state: id };
}

export function resetPhoneContacts() {
    return { type: types.RESET_PHONE_CONTACTS };
}
