import { Colors } from '../../styles';

import React, { Component, PropTypes } from 'react';
import {
    TabBarIOS,
    AppState,
    PushNotificationIOS
} from 'react-native';
import { connect } from 'react-redux';
import { ROUTES } from '../../constants/AppConstants';
// import TabNavigator from 'react-native-tab-navigator';
import { setGlobalBadgeNumber } from '../../redux/chat';
import ContactsView from '../ContactsView';
import ChatsView from '../ChatsView';
import SettingsView from '../SettingsView';
import Icon from 'react-native-vector-icons/Ionicons';

const CONTACTS = 'contacts';
const CHATS = 'chats';
const SETTINGS = 'settings';

class TabsView extends Component {

    constructor(props) {
        super(props);

        this.state = { selectedTab: CONTACTS };

        this.setTab = this.setTab.bind(this);
        this.isSelectedTab = this.isSelectedTab.bind(this);
        this.setBadgeNumber = this.setBadgeNumber.bind(this);
        this.handPushNotification = this.handPushNotification.bind(this);
    }

    componentWillMount() {
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

            // if (newAppState === 'active' && backgroundNotification === null) {
            //     // App was on and user just taps on the app
            //     this.setBadgeNumber();
            // }
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

    isSelectedTab(tab) {
        return this.state.selectedTab === tab;
    }

    setTab(tab) {
        this.setState({ selectedTab: tab });
    }

    renderContent(tabName) {
        if (tabName === CONTACTS) {
            return (<ContactsView {...this.props} />);
        } else if (tabName === CHATS) {
            return (<ChatsView {...this.props} />);
        } else if (tabName === SETTINGS) {
            return (<SettingsView {...this.props} />);
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
