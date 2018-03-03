import Config from 'react-native-config';

export const BASE_URL = Config.API_URL;
export const FIREBASE_DB = Config.FIREBASE_REF;
export const GOOGLE_TRACKING_ID = Config.GOOGLE_ANALYTICS;
export const INVITE_URL = 'http://api.txtling.com/in';

export const ROUTES = {
    introView: 'intro-view',
    phoneView: 'phone-view',
    infoView: 'info-view',
    languagesView: 'languages-view',
    inviteView: 'invite-view',
    tabsView: 'tabs-view',
    chatView: 'chat-view',
    chatSettingsView: 'chat-settings-view',
    contactView: 'contact-view'
};
