import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import ProfileView from '../ProfileView';
import Navigation from '../Navigation';
import { Row, RowButton } from '../Elements';
import { logout } from '../../redux/user';
import { ROUTES } from '../../constants/AppConstants';
import styles from './styles';

class SettingsView extends Component {
    static displayName = 'SettingsView'

    static propTypes = {
        logout: PropTypes.func.isRequired,
        navigator: PropTypes.object,
        profile: PropTypes.object.isRequired
    }

    handleButtonPress = () => {
        this.props.logout();
        this.props.navigator.push({ id: ROUTES.introView });
    }

    render() {
        return (
            <View style={styles.main}>
                <Navigation navTitle="Settings" />
                <ProfileView {...this.props}>
                    <Row text={this.props.profile.number} />
                    <RowButton text="Log out" onPress={this.handleButtonPress} rowTextStyle={styles.logoutButton} />
                </ProfileView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        profile: state.user
    };
}

export default connect(mapStateToProps, { logout })(SettingsView);
