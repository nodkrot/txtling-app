import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    AppState,
    View
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import firebaseRef from './firebase/database';
import { isLoggedIn } from './redux/user';
import Router from './router';
import { ROUTES } from './constants/AppConstants';

class App extends Component {
    static displayName = 'App'

    static propTypes = {
        isLoggedIn: PropTypes.func.isRequired,
        navigator: PropTypes.object,
        ui: PropTypes.shape({
            isScreenLoading: PropTypes.bool
        }),
        user: PropTypes.shape({
            _id: PropTypes.string,
            state: PropTypes.string,
            isUserLoggedIn: PropTypes.bool,
            isUserFetched: PropTypes.bool
        })
    }

    componentWillMount() {
        this.props.isLoggedIn();

        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = (appState) => {
        // TODO: handle logout state
        if (this.props.user.isUserLoggedIn) {
            const presenceRef = firebaseRef.child('presence').child(this.props.user._id);
            presenceRef.onDisconnect().remove();

            if (appState === 'active') {
                // TODO: Call getChats() if there were new push notifications to update chats view with badges
                // this.props.getChats();

                presenceRef.set(true);
            } else {
                presenceRef.set(false);
            }
        }
    }

    getInitialRoute() {
        if (this.props.user.isUserLoggedIn) {
            switch (this.props.user.state) {
                case 'confirmed':
                    return ROUTES.infoView;
                case 'registering':
                    return ROUTES.languagesView;
                case 'completed':
                    return ROUTES.tabsView;
                default:
                    return ROUTES.introView;
            }
        } else {
            return ROUTES.introView;
        }
    }

    render() {
        if (!this.props.user.isUserFetched) {
            return null;
        }

        return (
            <View style={{ flex: 1 }}>
                <Spinner visible={this.props.ui.isScreenLoading} />
                <Router initialRoute={this.getInitialRoute()} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        ui: state.ui
    };
}

export default connect(mapStateToProps, { isLoggedIn })(App);
