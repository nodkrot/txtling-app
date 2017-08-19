import { combineReducers } from 'redux';
import Contacts from './ContactsReducers';
import Login from './LoginReducers';
import UI from './UIReducers';
import chats from '../redux/chat';
import languages from '../redux/languages';
import ui from '../redux/ui.js';

export default combineReducers({
    Contacts, Login, chats, UI, languages, ui
});
