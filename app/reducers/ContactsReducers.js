import { chain } from 'lodash';
import * as types from '../constants/ContactsConstants';

const initialState = {
    chats: [],
    contacts: [],
    contactsDataBlob: {},
    contactsSectionIds: [],
    phoneContacts: [],
    phoneContactIds: {},
    chatBadgeNumber: 0
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

function compareChats(a, b) {
    if (a.badges < b.badges)
        return 1;
    if (a.badges > b.badges)
        return -1;
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
        } else {
            section = contact.first_name.charAt(0).toUpperCase();
        }

        if (contactsSectionIds.indexOf(section) === -1) {
            contactsSectionIds.push(section);
            contactsDataBlob[section] = [];
        }

        contactsDataBlob[section].push(contact);
    });

    return { contactsDataBlob, contactsSectionIds };
}

function parseContacts(state, action) {
    return chain(action.state)
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
        acc[String(contact.phone_id)] = { selected: false };
        return acc;
    }, {});
}

export default function (state = initialState, action) {

    switch (action.type) {

        case types.RECEIVE_GET_PHONE_CONTACTS:
            const phoneContacts = parseContacts(state, action);
            const phoneContactIds = parseContactIds(phoneContacts);

            return {
                ...state,
                phoneContacts,
                phoneContactIds
            };

        case types.RECEIVE_GET_CONTACTS:
        case types.RECEIVE_CREATE_CONTACTS:
            const { registered, nonregistered } = action.state;
            const contacts = registered.concat(nonregistered);
            const { contactsDataBlob, contactsSectionIds } = createContactsDataBlob(registered, nonregistered);

            return {
                ...state,
                contacts,
                contactsDataBlob,
                contactsSectionIds
            };

        case types.RECEIVE_GET_CHATS:
        case types.RECEIVE_CLEAR_CHAT_BADGES:
            return {
                ...state,
                chats: action.state.sort(compareChats),
                chatBadgeNumber: action.state.reduce((acc, group) => acc + group.badges, 0)
            };

        case types.RECEIVE_CREATE_CHAT:
            return {
                ...state,
                chats: [...action.state, ...state.chats]
            };

        case types.TOGGLE_SELECT_ROW:
            state.phoneContactIds[action.state].selected = !state.phoneContactIds[action.state].selected;

            return { ...state };

        case types.RESET_PHONE_CONTACTS:
            return {
                ...state,
                phoneContactIds: parseContactIds(state.phoneContacts)
            };

        default:
            return state;
    }
}
