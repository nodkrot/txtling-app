import React, { Component, PropTypes } from 'react';
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
    constructor(props) {
        super(props);

        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentWillMount() {
        this.props.isLoggedIn();

        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUpdate() {
        this.handleAppStateChange(AppState.currentState);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(appState) {
        // TODO: handle logout state
        if (this.props.ui.isUserLoggedIn) {
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
        if (this.props.ui.isUserLoggedIn) {
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
        if (!this.props.ui.isUserFetched) {
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

App.propTypes = {
    isLoggedIn: PropTypes.func.isRequired,
    navigator: PropTypes.object,
    ui: PropTypes.shape({
        isUserFetched: PropTypes.bool,
        isUserLoggedIn: PropTypes.bool,
        isScreenLoading: PropTypes.bool
    }),
    user: PropTypes.shape({
        _id: PropTypes.string,
        state: PropTypes.string,
        firebase_token: PropTypes.string
    })
};

function mapStateToProps(state) {
    return {
        user: state.user,
        ui: state.ui
    };
}

export default connect(mapStateToProps, { isLoggedIn })(App);
