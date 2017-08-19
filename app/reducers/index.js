import { combineReducers } from 'redux';
import Contacts from './ContactsReducers';
import UI from './UIReducers';
import user from '../redux/user.js';
import chats from '../redux/chat.js';
import languages from '../redux/languages.js';
import ui from '../redux/ui.js';

export default combineReducers({
    Contacts, chats, UI, languages, ui, user
});
