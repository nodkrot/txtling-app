import styles from './styles';

import React, { Component, PropTypes } from 'react';
import {
    View,
    NativeModules
} from 'react-native';
import Navigation from '../Navigation';
import ProfileView from '../ProfileView';
import { Row, RowButton } from '../Form';
import { INVITE_URL } from '../../constants/AppConstants.js';

const Composer = NativeModules.RNMessageComposer;

class ContactView extends Component {

    constructor(props) {
        super(props);

        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleInvite = this.handleInvite.bind(this);
    }

    handleBackButton() {
        this.props.navigator.pop();
    }

    handleInvite() {
        Composer.composeMessageWithArgs({
            messageText: `Hey, let\'s try Txtling: ${INVITE_URL}`,
            recipients: [this.props.profile.number]
        }, (result) => {
            switch (result) {
                case Composer.Sent:
                    this.handleBackButton();
                    break;
                case Composer.Cancelled:
                    console.log('user cancelled sending the message');
                    break;
                case Composer.Failed:
                    console.log('failed to send the message');
                    break;
                case Composer.NotSupported:
                    console.log('this device does not support sending texts');
                    break;
                default:
                    console.log('something unexpected happened');
                    break;
            }
        });
    }

    render() {
        const { number } = this.props.profile;

        return (
            <View style={styles.main}>
                <Navigation
                    navTitle="Info"
                    leftButtonTitle="Back"
                    leftHandler={this.handleBackButton} />
                <ProfileView {...this.props}>
                    <Row text={number} />
                    <RowButton text="Invite to Txtling" onPress={this.handleInvite} rowTextStyle={styles.inviteButton} />
                </ProfileView>
            </View>
        );
    }
}

ContactView.propTypes = {
    navigator: PropTypes.object,
    profile: PropTypes.object.isRequired
};

export default ContactView;
