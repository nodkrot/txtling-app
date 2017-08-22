import React, { Component, PropTypes } from 'react';
import {
    TabBarIOS,
    AppState,
    InteractionManager,
    PushNotificationIOS
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { ROUTES } from '../../constants/AppConstants';
import Tracker from '../../utilities/tracker';
// import TabNavigator from 'react-native-tab-navigator';
import { setGlobalBadgeNumber } from '../../redux/chat';
import ContactsView from '../ContactsView';
import ChatsView from '../ChatsView';
import SettingsView from '../SettingsView';
import { Colors } from '../../styles';

const CONTACTS = 'contacts-view';
const CHATS = 'chats-view';
const SETTINGS = 'settings-view';

class TabsView extends Component {
    constructor(props) {
        super(props);

        this.state = { selectedTab: CONTACTS };

        Tracker.trackScreenView(CONTACTS);

        this.setTab = this.setTab.bind(this);
        this.isSelectedTab = this.isSelectedTab.bind(this);
        this.setBadgeNumber = this.setBadgeNumber.bind(this);
        this.handPushNotification = this.handPushNotification.bind(this);
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            PushNotificationIOS.requestPermissions();
        });

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
            if (newAppState === 'active' && backgroundNotification !== null) {
                this.handPushNotification(backgroundNotification);
                backgroundNotification = null;
            }
        });

        // App was off
        // User received notification and just taps on the app
        // User just taps on the app
        this.setBadgeNumber();
    }

    setBadgeNumber() {
        PushNotificationIOS.getApplicationIconBadgeNumber((badgeNumber) => {
            this.props.setGlobalBadgeNumber(badgeNumber);
        });
    }

    handPushNotification(notification) {
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

    isSelectedTab(tabName) {
        return this.state.selectedTab === tabName;
    }

    setTab(tabName) {
        Tracker.trackScreenView(tabName);
        this.setState({ selectedTab: tabName });
    }

    renderContent(tabName) {
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

    render() {
        return (
            <TabBarIOS
                selectedTab={this.state.selectedTab}
                tintColor={Colors.primary}
                barTintColor={Colors.lightGrey}>
                <Icon.TabBarItemIOS
                    iconName="ios-people-outline"
                    selectedIconName="ios-people"
                    title="Contacts"
                    iconSize={32}
                    accessibilityLabel="Contacts"
                    selected={this.isSelectedTab(CONTACTS)}
                    onPress={() => this.setTab(CONTACTS)}>
                    {this.renderContent(CONTACTS)}
                </Icon.TabBarItemIOS>
                <Icon.TabBarItemIOS
                    iconName="ios-chatbubbles-outline"
                    selectedIconName="ios-chatbubbles"
                    title="Chats"
                    iconSize={32}
                    badge={this.props.badgeNumber > 0 ? this.props.badgeNumber : undefined}
                    accessibilityLabel="Chats"
                    selected={this.isSelectedTab(CHATS)}
                    onPress={() => this.setTab(CHATS)}>
                    {this.renderContent(CHATS)}
                </Icon.TabBarItemIOS>
                <Icon.TabBarItemIOS
                    iconName="ios-settings-outline"
                    selectedIconName="ios-settings"
                    title="Settings"
                    iconSize={32}
                    accessibilityLabel="Settings"
                    selected={this.isSelectedTab(SETTINGS)}
                    onPress={() => this.setTab(SETTINGS)}>
                    {this.renderContent(SETTINGS)}
                </Icon.TabBarItemIOS>
            </TabBarIOS>
        );

        // return (
        //     <TabNavigator>
        //         <TabNavigator.Item
        //             selected={this.isSelectedTab(CONTACTS)}
        //             title={CONTACTS}
        //             renderIcon={() => <Icon name="ios-people-outline" size={32} color={Colors.darkerGrey} />}
        //             renderSelectedIcon={() => <Icon name="ios-people" size={32} color={Colors.primary} />}
        //             onPress={() => this.setTab(CONTACTS)}>
        //             {this.renderContent(CONTACTS)}
        //         </TabNavigator.Item>
        //         <TabNavigator.Item
        //             selected={this.isSelectedTab(CHATS)}
        //             title={CHATS}
        //             renderIcon={() => <Icon name="ios-chatbubbles-outline" size={32} color={Colors.darkerGrey} />}
        //             renderSelectedIcon={() => <Icon name="ios-chatbubbles" size={32} color={Colors.primary} />}
        //             onPress={() => this.setTab(CHATS)}>
        //             {this.renderContent(CHATS)}
        //         </TabNavigator.Item>
        //         <TabNavigator.Item
        //             selected={this.isSelectedTab(SETTINGS)}
        //             title={SETTINGS}
        //             renderIcon={() => <Icon name="ios-settings-outline" size={32} color={Colors.darkerGrey} />}
        //             renderSelectedIcon={() => <Icon name="ios-settings" size={32} color={Colors.primary} />}
        //             onPress={() => this.setTab(SETTINGS)}>
        //             {this.renderContent(SETTINGS)}
        //         </TabNavigator.Item>
        //     </TabNavigator>
        // );
    }
}

TabsView.propTypes = {
    badgeNumber: PropTypes.number,
    navigator: PropTypes.object,
    setGlobalBadgeNumber: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        badgeNumber: state.chats.chatBadgeNumber
    };
}

export default connect(mapStateToProps, { setGlobalBadgeNumber })(TabsView);
