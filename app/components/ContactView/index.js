import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    NativeModules
} from 'react-native';
import Navigation from '../Navigation';
import ProfileView from '../ProfileView';
import { Row, RowButton } from '../Elements';
import Tracker from '../../utilities/tracker';
import { INVITE_URL } from '../../constants/AppConstants';
import styles from './styles';

const Composer = NativeModules.RNMessageComposer;

class ContactView extends Component {
    static displayName = 'ContactView'

    static propTypes = {
        navigator: PropTypes.object,
        profile: PropTypes.object.isRequired
    }

    handleBackButton = () => {
        this.props.navigator.pop();
    }

    handleInvite = () => {
        Tracker.trackEvent('CTA', 'Single Invite');

        Composer.composeMessageWithArgs({
            messageText: `Hey, let's try Txtling: ${INVITE_URL}`,
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
                    <RowButton
                        text="Invite to Txtling"
                        onPress={this.handleInvite}
                        rowTextStyle={styles.inviteButton} />
                </ProfileView>
            </View>
        );
    }
}

export default ContactView;
