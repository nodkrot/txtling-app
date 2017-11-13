const isProduction = process.env.NODE_ENV === 'production';

// TODO: needs to work through HTTPS
// export const BASE_URL = 'https://api.txtling.com/';
export const BASE_URL = isProduction
    ? 'https://txtling.herokuapp.com/'
    : 'http://localhost:3000/';

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
