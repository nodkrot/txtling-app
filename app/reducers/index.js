import { combineReducers } from 'redux';
import Contacts from './ContactsReducers';
import Login from './LoginReducers';
import Chat from './ChatReducers';
import UI from './UIReducers';

export default combineReducers({
    Contacts, Login, Chat, UI
});
