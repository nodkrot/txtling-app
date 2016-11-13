import styles from './styles';

import React, { Component, PropTypes } from 'react';
import {
    Animated,
    Navigator,
    PushNotificationIOS,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { formatPhone } from '../../utilities';
import * as LoginActions from '../../actions/LoginActions';
import { ROUTES } from '../../constants/AppConstants';
import Navigation from '../Navigation';
import { Button } from '../Elements';
import { TextField } from '../Form';

class PhoneView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            code: '',
            codeFieldHeight: new Animated.Value(0),
            isCodeFieldActive: false,
            isTokenReistered: false
        };

        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handlePhoneFocus = this.handlePhoneFocus.bind(this);
        this.handlePhoneSubmit = this.handlePhoneSubmit.bind(this);
        this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handlePushRegistration = this.handlePushRegistration.bind(this);
    }

    componentWillMount() {
        PushNotificationIOS.addEventListener('register', this.handlePushRegistration);
    }

    componentWillUnmount() {
        PushNotificationIOS.removeEventListener('register', this.handlePushRegistration);
    }

    handlePushRegistration(token) {
        // This is a bug, event is triggered twice, will be fixed in future RN versions
        if (!this.state.isTokenReistered) {
            this.props.registerDeviceToken({ device_token: token });
            this.setState({ isTokenReistered: true });
        }
    }

    toggleCodeField(toValue, duration = 255) {
        return new Promise((resolve) => {
            Animated.timing(
                this.state.codeFieldHeight,
                { toValue, duration }
            ).start(() => {
                resolve();
            });
        });
    }

    handlePhoneFocus() {
        this.setState({ isCodeFieldActive: false });
        this.toggleCodeField(0);
    }

    handlePhoneChange(value) {
        this.setState({ phone: formatPhone(value) });
    }

    handleCodeChange(value) {
        this.setState({ code: value });
    }

    handlePhoneSubmit() {
        const phoneNumber = this.state.phone.replace(/\(|\)| |-|\D/g, '');

        if (phoneNumber.length < 10) {
            return;
        }

        this.props.generateCode({
            number: `+1${this.state.phone}`
        }).then(() => {
            this.setState({ isCodeFieldActive: true });
            this.toggleCodeField(56).then(() => {
                this.refs.codeField.focus();
            });
        }).catch((err) => console.log(err));
    }

    handleCodeSubmit() {
        if (this.state.code < 6) {
            return;
        }

        this.props.confirmCode(
            this.props.login.number,
            this.state.code
        ).then(() => {

            PushNotificationIOS.requestPermissions();

            if (this.props.login.state === 'completed') {
                this.props.navigator.push({
                    id: ROUTES.tabsView,
                    sceneConfig: {
                        ...Navigator.SceneConfigs.HorizontalSwipeJump,
                        gestures: null
                    }
                });
            } else if (this.props.login.state === 'registering') {
                this.props.navigator.push({
                    id: ROUTES.languagesView,
                    sceneConfig: {
                        ...Navigator.SceneConfigs.HorizontalSwipeJump,
                        gestures: null
                    }
                });
            } else {
                this.props.navigator.push({
                    id: ROUTES.infoView,
                    sceneConfig: {
                        ...Navigator.SceneConfigs.HorizontalSwipeJump,
                        gestures: null
                    }
                });
            }
        }).catch((err) => console.log(err));
    }

    handleBackButton() {
        this.props.navigator.pop();
    }

    render() {
        const button = this.state.isCodeFieldActive
            ? (<Button
                    text="Next"
                    onPress={this.handleCodeSubmit} />)
            : (<Button
                    text="Get Code"
                    onPress={this.handlePhoneSubmit} />);

        return (
            <View style={styles.main}>
                <Navigation
                    navTitle="Phone View"
                    leftButtonTitle="Back"
                    leftHandler={this.handleBackButton} />
                <View style={styles.container}>
                    <View style={styles.formGroup}>
                        <TextField
                            style={{ width: 44 }}
                            textAlign="center"
                            editable={false}
                            defaultValue="+1" />
                        <TextField
                            ref="phoneField"
                            style={{ flex: 1 }}
                            placeholder="Your phone number"
                            keyboardType="phone-pad"
                            value={this.state.phone}
                            onChangeText={this.handlePhoneChange}
                            onFocus={this.handlePhoneFocus}
                            focused />
                    </View>
                    <Animated.View style={[{ height: this.state.codeFieldHeight }, styles.formGroup]}>
                        <TextField
                            style={{ width: 44 }}
                            textAlign="center"
                            editable={false}
                            defaultValue="C-" />
                        <TextField
                            ref="codeField"
                            style={{ flex: 1 }}
                            placeholder="Your code"
                            keyboardType="number-pad"
                            maxLength={6}
                            onChangeText={this.handleCodeChange} />
                    </Animated.View>
                    {button}
                </View>
            </View>
        );
    }
}

PhoneView.propTypes = {
    confirmCode: PropTypes.func,
    generateCode: PropTypes.func,
    login: PropTypes.object,
    navigator: PropTypes.object,
    registerDeviceToken: PropTypes.func
};

function mapStateToProps(state) {
    return {
        login: state.Login
    };
}

export default connect(mapStateToProps, LoginActions)(PhoneView);
