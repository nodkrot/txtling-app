import React, { Component, PropTypes } from 'react';
import {
    AppState,
    // Animated,
    // Image,
    View
} from 'react-native';
import Firebase from 'firebase';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { isLoggedIn } from './actions/LoginActions';
import Router from './router';
import { ROUTES } from './constants/AppConstants';

const SCREEN_WIDTH = Dimensions.get('window').width;
// const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    loader: {
        width: 52,
        height: 52
    },
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: SCREEN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // fadeAnim: new Animated.Value(0),
            overlayHeight: 0
        };

        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentWillMount() {
        this.firebaseRef = new Firebase('https://txtling.firebaseio.com');
        this.props.isLoggedIn();

        AppState.addEventListener('change', this.handleAppStateChange);
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.ui.isScreenLoading !== this.props.ui.isScreenLoading) {
    //         if (nextProps.ui.isScreenLoading) {
    //             this.animateOverlay(1);
    //         } else {
    //             this.animateOverlay(0);
    //         }
    //     }
    // }

    componentWillUpdate() {
        this.handleAppStateChange(AppState.currentState);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(appState) {
        // TODO: handle logout state
        if (this.props.ui.isUserLoggedIn) {
            const presenceRef = this.firebaseRef.child('presence').child(this.props.user._id);
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

    // animateOverlay(toValue = 0, duration = 175) {
    //     this.setState({ overlayHeight: SCREEN_HEIGHT }, () => {
    //         Animated.timing(
    //             this.state.fadeAnim,
    //             { toValue, duration }
    //         ).start(({ finished }) => {
    //             if (finished && !toValue) {
    //                 this.setState({ overlayHeight: 0 });
    //             }
    //         });
    //     });
    // }

    getInitialRoute() {
        if (this.props.ui.isUserLoggedIn) {
            return ROUTES.tabsView;
        } else {
            return ROUTES.introView;
        }
    }

    render() {
        if (this.props.ui.isFetchingUser) {
            return null;
        }

        return (
            <View style={styles.main}>
                <Router initialRoute={this.getInitialRoute()} />
            </View>
        );
    }
}

// <Animated.View style={[{
//     opacity: this.state.fadeAnim,
//     height: this.state.overlayHeight
// }, styles.overlay]}>
//     <Image style={styles.loader} source={require('./images/loader.gif')} />
// </Animated.View>

App.propTypes = {
    isLoggedIn: PropTypes.func.isRequired,
    navigator: PropTypes.object,
    ui: PropTypes.shape({
        isUserLoggedIn: PropTypes.bool,
        isFetchingUser: PropTypes.bool,
        isScreenLoading: PropTypes.bool
    }),
    user: PropTypes.shape({
        _id: PropTypes.string,
        firebase_token: PropTypes.string
    })
};

function mapStateToProps(state) {
    return {
        user: state.Login,
        ui: state.UI
    };
}

export default connect(mapStateToProps, { isLoggedIn })(App);
