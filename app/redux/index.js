import { combineReducers } from 'redux';
import user from '../redux/user.js';
import chats from '../redux/chat.js';
import contacts from '../redux/contacts.js';
import languages from '../redux/languages.js';
import ui from '../redux/ui.js';

export default combineReducers({ chats, languages, user, contacts, ui });
