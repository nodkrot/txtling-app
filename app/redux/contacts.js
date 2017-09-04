/* eslint no-case-declarations: 0 */
import { chain } from 'lodash';
import { AsyncStorage } from 'react-native';
import Contacts from 'react-native-contacts';
import { BASE_URL } from '../constants/AppConstants';
import { LOGOUT } from './user';

export const GET_CONTACTS = 'GET_CONTACTS';
export const GET_PHONE_CONTACTS = 'GET_PHONE_CONTACTS';
export const CREATE_CONTACTS = 'CREATE_CONTACTS';
export const TOGGLE_SELECT_ROW = 'TOGGLE_SELECT_ROW';
export const RESET_PHONE_CONTACTS = 'RESET_PHONE_CONTACTS';

export const toggleRow = (id) => ({ type: TOGGLE_SELECT_ROW, payload: id });

export const resetPhoneContacts = () => ({ type: RESET_PHONE_CONTACTS });

export const getContacts = () => ({
    type: GET_CONTACTS,
    payload: AsyncStorage.getItem('AUTH_TOKEN')
        .then((value) => fetch(`${BASE_URL}contacts`, {
            headers: {
                Authorization: `JWT ${value}`
            }
        }))
        .then((response) => response.json())
        .then((res) => res.data)
        .catch((err) => console.log(err)) // eslint-disable-line
});

export const getPhoneContacts = () => {
    return (dispatch, getState) => {
        const { phoneContacts } = getState().contacts;

        if (!phoneContacts.length) {
            return dispatch({
                type: GET_PHONE_CONTACTS,
                payload: new Promise((resolve, reject) => {
                    Contacts.getAll((err, addressBook) => {
                        if (err && err.type === 'permissionDenied') {
                            reject(err);
                        } else {
                            resolve(addressBook);
                        }
                    });
                })
            });
        }

        // Cannot return `phoneContacts` since they are already parsed
        // Data structure won't match
        return Promise.resolve();
    };
};

export const createContacts = () => {
    return (dispatch, getState) => {
        return dispatch(getPhoneContacts()).then(() => {
            const { phoneContacts } = getState().contacts;

            return dispatch({
                type: CREATE_CONTACTS,
                payload: AsyncStorage.getItem('AUTH_TOKEN')
                    .then((value) => fetch(`${BASE_URL}contacts`, {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `JWT ${value}`
                        },
                        body: JSON.stringify({ contacts: phoneContacts })
                    }))
                    .then((response) => response.json())
                    .then((res) => res.data)
                }).catch((err) => console.log(err)); // eslint-disable-line
            });
    };
};

// Move sorting to backend
function compareContacts(a, b) {
    const first = a.last_name.length ? a.last_name : a.first_name;
    const second = b.last_name.length ? b.last_name : b.first_name;

    if (first < second) {
        return -1;
    }
    if (first > second) {
        return 1;
    }
    return 0;
}

function createContactsDataBlob(registered, nonregistered) {
    const registeredSection = 'registered';
    const contactsSectionIds = [registeredSection];
    const contactsDataBlob = { [registeredSection]: [] };

    registered.sort(compareContacts).forEach((contact) => {
        contactsDataBlob[registeredSection].push(contact);
    });

    nonregistered.sort(compareContacts).forEach((contact) => {
        let section;

        if (contact.last_name.length) {
            section = contact.last_name.charAt(0).toUpperCase();
        } else if (contact.first_name.length) {
            section = contact.first_name.charAt(0).toUpperCase();
        } else {
            section = 'N/A';
        }

        if (!Array.isArray(contactsDataBlob[section])) {
            contactsSectionIds.push(section);
            contactsDataBlob[section] = [];
        }

        contactsDataBlob[section].push(contact);
    });

    return { contactsDataBlob, contactsSectionIds };
}

function parseContacts(contacts) {
    return chain(contacts)
        .filter((contact) => contact.phoneNumbers.length > 0)
        .reduce((acc, contact) => {
            return acc.concat(contact.phoneNumbers.map((phoneNumber) => ({
                first_name: contact.givenName || '',
                last_name: contact.familyName || '',
                number: phoneNumber.number,
                phone_id: phoneNumber.number.replace(/\D/g, '')
            })));
        }, [])
        .uniqBy('phone_id')
        .value();
}

function parseContactIds(contacts) {
    return contacts.reduce((acc, contact) => {
        acc[String(contact.phone_id)] = {
            selected: false,
            first_name: contact.first_name,
            last_name: contact.last_name
        };

        return acc;
    }, {});
}

const initialState = {
    contactsDataBlob: {},
    contactsSectionIds: [],
    phoneContacts: [],
    phoneContactIds: {},
    allowAccessContacts: true,
    fetchStatus: 'none'
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case `${GET_PHONE_CONTACTS}_FULFILLED`:
            const phoneContacts = parseContacts(action.payload);
            const phoneContactIds = parseContactIds(phoneContacts);

            return {
                ...state,
                phoneContacts,
                phoneContactIds
            };
        case `${GET_CONTACTS}_FULFILLED`:
        case `${CREATE_CONTACTS}_FULFILLED`:
            // TODO: deprecate non registered users
            const { registered, nonregistered } = action.payload;
            const { contactsDataBlob, contactsSectionIds } = createContactsDataBlob(registered, state.phoneContacts);

            return {
                ...state,
                contactsDataBlob,
                contactsSectionIds,
                fetchStatus: 'success'
            };
        case `${GET_CONTACTS}_REJECTED`:
        case `${CREATE_CONTACTS}_REJECTED`:
            return {
                ...state,
                fetchStatus: 'failure'
            };
        case TOGGLE_SELECT_ROW:
            state.phoneContactIds[action.payload].selected = !state.phoneContactIds[action.payload].selected;
            return { ...state };
        case RESET_PHONE_CONTACTS:
            return { ...state, phoneContactIds: parseContactIds(state.phoneContacts) };
        case `${GET_PHONE_CONTACTS}_REJECTED`:
            return { ...state, allowAccessContacts: false };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
