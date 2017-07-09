/* eslint no-case-declarations: 0 */
import { chain } from 'lodash';
import * as types from '../constants/ContactsConstants';
import { LOGOUT } from '../constants/LoginConstants';

const initialState = {
    contactsDataBlob: {},
    contactsSectionIds: [],
    phoneContacts: [],
    phoneContactIds: {},
    allowAccessContacts: true
};

// Move sorting to backend
function compareContacts(a, b) {
    const first = a.last_name.length ? a.last_name : a.first_name;
    const second = b.last_name.length ? b.last_name : b.first_name;

    if (first < second)
        return -1;
    if (first > second)
        return 1;
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

export default function (state = initialState, action) {

    switch (action.type) {

        case types.RECEIVE_GET_PHONE_CONTACTS:
            const phoneContacts = parseContacts(action.state);
            const phoneContactIds = parseContactIds(phoneContacts);

            return {
                ...state,
                phoneContacts,
                phoneContactIds
            };

        case types.RECEIVE_GET_CONTACTS:
        case types.RECEIVE_CREATE_CONTACTS:
            // TODO: deprecate non registered users
            const { registered, nonregistered } = action.state;
            const { contactsDataBlob, contactsSectionIds } = createContactsDataBlob(registered, state.phoneContacts);

            return {
                ...state,
                contactsDataBlob,
                contactsSectionIds
            };

        case types.TOGGLE_SELECT_ROW:
            state.phoneContactIds[action.state].selected = !state.phoneContactIds[action.state].selected;

            return { ...state };

        case types.RESET_PHONE_CONTACTS:
            return { ...state, phoneContactIds: parseContactIds(state.phoneContacts) };

        case types.FAILURE_GET_PHONE_CONTACTS:
            return { ...state, allowAccessContacts: false };

        case LOGOUT:
            return initialState;

        default:
            return state;
    }
}
