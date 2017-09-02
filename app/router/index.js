import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navigator } from 'react-native';
import Dimensions from 'Dimensions';
import { ROUTES } from '../constants/AppConstants';
import IntroView from '../components/IntroView';
import PhoneView from '../components/PhoneView';
import InfoView from '../components/InfoView';
import LanguagesView from '../components/LanguagesView';
import InviteView from '../components/InviteView';
import TabsView from '../components/TabsView';
import ChatView from '../components/ChatView';
import ChatSettingsView from '../components/ChatSettingsView';
import ContactView from '../components/ContactView';
import Tracker from '../utilities/tracker';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BaseConfig = Navigator.SceneConfigs.FloatFromRight;
const CustomSceneConfig = {
    ...BaseConfig,
    gestures: {
        pop: {
            ...BaseConfig.gestures.pop,
            snapVelocity: 8,
            edgeHitWidth: SCREEN_WIDTH * 0.15
        }
    }
};

export default class Router extends Component {
    renderScene(route, navigator) {
        // TabView is being tracked by itself in TabsView.js
        if (route.id !== ROUTES.tabsView) {
            Tracker.trackScreenView(route.id);
        }

        switch (route.id) {
            case ROUTES.introView:
                return (<IntroView navigator={navigator} {...route.passProps} />);
            case ROUTES.phoneView:
                return (<PhoneView navigator={navigator} {...route.passProps} />);
            case ROUTES.infoView:
                return (<InfoView navigator={navigator} {...route.passProps} />);
            case ROUTES.languagesView:
                return (<LanguagesView navigator={navigator} {...route.passProps} />);
            case ROUTES.inviteView:
                return (<InviteView navigator={navigator} {...route.passProps} />);
            case ROUTES.tabsView:
                return (<TabsView navigator={navigator} {...route.passProps} />);
            case ROUTES.chatView:
                return (<ChatView navigator={navigator} {...route.passProps} />);
            case ROUTES.chatSettingsView:
                return (<ChatSettingsView navigator={navigator} {...route.passProps} />);
            case ROUTES.contactView:
                return (<ContactView navigator={navigator} {...route.passProps} />);
            default:
                throw new Error(`Route with id ${route.id} doesn't exist.`);
        }
    }

    configureScene(route) {
        return route.sceneConfig || CustomSceneConfig;
    }

    render() {
        return (
            <Navigator
                initialRoute={{ id: this.props.initialRoute }}
                renderScene={this.renderScene}
                configureScene={this.configureScene} />
        );
    }
}

Router.propTypes = {
    initialRoute: PropTypes.string.isRequired
};
