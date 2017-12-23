import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppState, NetInfo, View, Text } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import firebaseRef from './firebase/database';
import { isLoggedIn } from './redux/user';
import Router from './router';
import { ROUTES } from './constants/AppConstants';

class App extends Component {
    static displayName = 'App'

    static propTypes = {
        isLoggedIn: PropTypes.func,
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

    state = {
        offlineAlert: true
    }

    componentWillMount() {
        this.props.isLoggedIn();

        AppState.addEventListener('change', this.handleAppStateChange);
        NetInfo.addEventListener('connectionChange', this.handleNetInfoChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        NetInfo.removeEventListener('connectionChange', this.handleNetInfoChange);
    }

    handleAppStateChange = (appState) => {
        if (this.props.user.isUserLoggedIn) {
            const presenceRef = firebaseRef.child('presence').child(this.props.user._id);
            presenceRef.onDisconnect().remove();

            if (appState === 'active') {
                presenceRef.set(true);
            } else {
                presenceRef.set(false);
            }
        }
    }

    handleNetInfoChange = (connectionInfo) => {
        if (connectionInfo === 'none') {
            this.setState({ offlineAlert: true });
        } else {
            this.setState({ offlineAlert: false });
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

    renderOfflineAlert = () => {
        const style = { textAlign: 'center', paddingTop: 4, paddingBottom: 4 };
        return <View><Text style={style}>Txtling is offline</Text></View>;
    }

    render() {
        if (!this.props.user.isUserFetched) {
            return null;
        }

        return (
            <View style={{ flex: 1 }}>
                <Spinner visible={this.props.ui.isScreenLoading} animation="fade" />
                <Router initialRoute={this.getInitialRoute()} />
                {this.state.offlineAlert && this.renderOfflineAlert()}
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
