const isProduction = process.env.NODE_ENV === 'production';

// export const BASE_URL = 'http://api.txtling.com/';
export const BASE_URL = isProduction
    ? 'http://txtling.herokuapp.com/'
    : 'http://192.168.1.151:3000/';

export const FIREBASE_DB = isProduction
    ? 'https://txtling.firebaseio.com/'
    : 'https://txtling-sandbox.firebaseio.com/';

export const INVITE_URL = 'http://api.txtling.com/in';

export const GOOGLE_TRACKING_ID = 'UA-44634837-1';

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
