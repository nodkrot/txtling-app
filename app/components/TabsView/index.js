import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    AppState,
    InteractionManager,
    PushNotificationIOS
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';
import { ROUTES } from '../../constants/AppConstants';
import { isIphoneX } from '../../utilities';
import Tracker from '../../utilities/tracker';
import { setGlobalBadgeNumber, updateBadgesAndChats } from '../../redux/chat';
import { registerDeviceToken } from '../../redux/user';
import ContactsView from '../ContactsView';
import ChatsView from '../ChatsView';
import SettingsView from '../SettingsView';
import { Colors } from '../../styles';
import styles from './styles';

const CONTACTS = 'contacts-view';
const CHATS = 'chats-view';
const SETTINGS = 'settings-view';

class TabsView extends Component {
    static displayName = 'TabsView'

    static propTypes = {
        badgeNumber: PropTypes.number,
        navigator: PropTypes.object,
        setGlobalBadgeNumber: PropTypes.func.isRequired,
        updateBadgesAndChats: PropTypes.func.isRequired,
        registerDeviceToken: PropTypes.func.isRequired
    }

    state = { selectedTab: CHATS }

    constructor() {
        super();

        Tracker.trackScreenView(CONTACTS);
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            PushNotificationIOS.requestPermissions();
        });

        PushNotificationIOS.addEventListener('register', (token) => {
            this.props.registerDeviceToken({ device_token: token });
        });

        // https://stackoverflow.com/questions/34337117/detect-whether-react-native-ios-app-was-opened-via-push-notification
        let backgroundNotification = null;

        PushNotificationIOS.getInitialNotification().then((notification) => {
            if (notification != null) {
                this.handPushNotification(notification);
            }
        });

        PushNotificationIOS.addEventListener('notification', (notification) => {
            if (AppState.currentState === 'background') {
                backgroundNotification = notification;
            }
        });

        AppState.addEventListener('change', (newAppState) => {
            if (newAppState === 'active') {
                if (backgroundNotification !== null) {
                    this.handPushNotification(backgroundNotification);
                    backgroundNotification = null;
                } else {
                    // if there were new push notifications
                    // while app was in the background
                    // we need to update chats view with badges
                    this.props.updateBadgesAndChats();
                }
            }
        });

        // App was completely off
        // User received notification
        // User just taps on the app (not notification toast)
        PushNotificationIOS.getApplicationIconBadgeNumber((badgeNumber) => {
            this.props.setGlobalBadgeNumber(badgeNumber);
        });
    }

    handPushNotification = (notification) => {
        const data = notification.getData();
        const currentRoutes = this.props.navigator.getCurrentRoutes();
        const currentRoute = currentRoutes[currentRoutes.length - 1];

        if (currentRoute.id === ROUTES.chatView) {
            if (currentRoute.passProps.groupId !== data.group_id) {
                this.props.navigator.replace({
                    id: ROUTES.chatView,
                    passProps: {
                        groupId: data.group_id,
                        navTitle: data.first_name
                    }
                });
            }
        } else {
            this.props.navigator.push({
                id: ROUTES.chatView,
                passProps: {
                    groupId: data.group_id,
                    navTitle: data.first_name
                }
            });
        }
    }

    isSelectedTab = (tabName) => this.state.selectedTab === tabName

    setTab = (tabName) => {
        Tracker.trackScreenView(tabName);
        this.setState({ selectedTab: tabName });
    }

    renderContent = (tabName) => {
        switch (tabName) {
            case CONTACTS:
                return <ContactsView {...this.props} />;
            case CHATS:
                return <ChatsView {...this.props} />;
            case SETTINGS:
                return <SettingsView {...this.props} />;
            default:
                return null;
        }
    }

    maybeRenderBadge = () => {
        if (this.props.badgeNumber > 0) {
            return (
                <View style={styles.badgeStyle}>
                    <Text style={styles.badgeTextStyle}>{this.props.badgeNumber}</Text>
                </View>);
        }

        return null;
    }

    render() {
        return (
            <TabNavigator tabBarStyle={[isIphoneX() ? styles.iphoneXTabBarSpace : null]}>
                <TabNavigator.Item
                    selected={this.isSelectedTab(CONTACTS)}
                    title="Contacts"
                    titleStyle={styles.titleStyle}
                    selectedTitleStyle={styles.selectedTitleStyle}
                    renderIcon={() => <Icon name="ios-people-outline" size={30} color={Colors.darkerGrey} />}
                    renderSelectedIcon={() => <Icon name="ios-people" size={30} color={Colors.primary} />}
                    onPress={() => this.setTab(CONTACTS)}>
                    {this.renderContent(CONTACTS)}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.isSelectedTab(CHATS)}
                    title="Chats"
                    titleStyle={styles.titleStyle}
                    selectedTitleStyle={styles.selectedTitleStyle}
                    renderIcon={() => <Icon name="ios-chatbubbles-outline" size={30} color={Colors.darkerGrey} />}
                    renderSelectedIcon={() => <Icon name="ios-chatbubbles" size={30} color={Colors.primary} />}
                    badgeText={1}
                    renderBadge={this.maybeRenderBadge}
                    onPress={() => this.setTab(CHATS)}>
                    {this.renderContent(CHATS)}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.isSelectedTab(SETTINGS)}
                    title="Settings"
                    titleStyle={styles.titleStyle}
                    selectedTitleStyle={styles.selectedTitleStyle}
                    renderIcon={() => <Icon name="ios-settings-outline" size={30} color={Colors.darkerGrey} />}
                    renderSelectedIcon={() => <Icon name="ios-settings" size={30} color={Colors.primary} />}
                    onPress={() => this.setTab(SETTINGS)}>
                    {this.renderContent(SETTINGS)}
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}

function mapStateToProps(state) {
    return {
        badgeNumber: state.chats.chatBadgeNumber
    };
}

export default connect(mapStateToProps, {
    setGlobalBadgeNumber,
    updateBadgesAndChats,
    registerDeviceToken
})(TabsView);
