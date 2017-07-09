// export const BASE_URL = 'http://api.txtling.com/';
// export const BASE_URL = 'http://txtling.herokuapp.com/';
export const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'http://txtling.herokuapp.com/'
    : 'http://192.168.1.151:3000/';
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
