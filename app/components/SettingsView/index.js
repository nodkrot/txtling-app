import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Navigator } from 'react-native';
import { connect } from 'react-redux';
import ProfileView from '../ProfileView';
import Navigation from '../Navigation';
import { Row, RowButton } from '../Elements';
import { logout } from '../../redux/user';
import { ROUTES } from '../../constants/AppConstants';
import Tracker from '../../utilities/tracker';
import styles from './styles';

class SettingsView extends Component {
    static displayName = 'SettingsView'

    static propTypes = {
        logout: PropTypes.func.isRequired,
        navigator: PropTypes.object,
        user: PropTypes.object.isRequired
    }

    handleButtonPress = () => {
        this.props.logout(this.props.user._id);
        this.props.navigator.push({
            id: ROUTES.introView,
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump,
                gestures: null
            }
        });

        Tracker.trackEvent('CTA', 'Logout');
    }

    render() {
        return (
            <View style={styles.main}>
                <Navigation navTitle="Settings" />
                <ProfileView profile={this.props.user}>
                    <Row text={this.props.user.number} />
                    <RowButton text="Log out" onPress={this.handleButtonPress} rowTextStyle={styles.logoutButton} />
                </ProfileView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps, { logout })(SettingsView);
