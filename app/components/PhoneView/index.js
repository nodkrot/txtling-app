import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    Navigator,
    PushNotificationIOS,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { formatPhone } from '../../utilities';
import { registerDeviceToken, generateCode, confirmCode } from '../../redux/user';
import { ROUTES } from '../../constants/AppConstants';
import Navigation from '../Navigation';
import { Button, TextField } from '../Elements';
import styles from './styles';

class PhoneView extends Component {
    static displayName = 'PhoneView'

    static propTypes = {
        confirmCode: PropTypes.func,
        generateCode: PropTypes.func,
        login: PropTypes.object,
        navigator: PropTypes.object,
        registerDeviceToken: PropTypes.func,
        isGetCodeLoading: PropTypes.bool,
        isConfirmCodeLoading: PropTypes.bool
    }

    state = {
        phone: '',
        code: '',
        codeFieldHeight: new Animated.Value(0),
        isCodeFieldActive: false,
        isTokenReistered: false
    }

    componentWillMount() {
        PushNotificationIOS.addEventListener('register', this.handlePushRegistration);
    }

    componentWillUnmount() {
        PushNotificationIOS.removeEventListener('register', this.handlePushRegistration);
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

    handlePushRegistration = (token) => {
        // This is a bug, event is triggered twice, will be fixed in future RN versions
        if (!this.state.isTokenReistered) {
            this.props.registerDeviceToken({ device_token: token });
            this.setState({ isTokenReistered: true });
        }
    }

    handlePhoneFocus = () => {
        this.setState({ isCodeFieldActive: false });
        this.toggleCodeField(0);
    }

    handlePhoneChange = (value) => {
        this.setState({ phone: formatPhone(value) });
    }

    handleCodeChange = (value) => {
        this.setState({ code: value });
    }

    handlePhoneSubmit = () => {
        const phoneNumber = this.state.phone.replace(/\(|\)| |-|\D/g, '');

        if (phoneNumber.length < 10) {
            return;
        }

        this.props.generateCode({
            number: `+1${this.state.phone}`
        }).then(() => {
            this.setState({ isCodeFieldActive: true });
            this.toggleCodeField(56).then(() => {
                this.codeField.focus();
            });
        }).catch((err) => console.log(err));
    }

    handleCodeSubmit = () => {
        if (this.state.code < 6) {
            return;
        }

        this.props.confirmCode(
            this.props.login.number,
            this.state.code
        ).then(() => {
            switch (this.props.login.state) {
                case 'confirmed':
                    this.props.navigator.push({
                        id: ROUTES.infoView,
                        sceneConfig: {
                            ...Navigator.SceneConfigs.HorizontalSwipeJump,
                            gestures: null
                        }
                    });
                    break;
                case 'registering':
                    this.props.navigator.push({
                        id: ROUTES.languagesView,
                        sceneConfig: {
                            ...Navigator.SceneConfigs.HorizontalSwipeJump,
                            gestures: null
                        }
                    });
                    break;
                case 'completed':
                    this.props.navigator.push({
                        id: ROUTES.tabsView,
                        sceneConfig: {
                            ...Navigator.SceneConfigs.HorizontalSwipeJump,
                            gestures: null
                        }
                    });
                    break;
                default:
                    break;
            }
        }).catch((err) => console.log(err));
    }

    handleBackButton = () => {
        this.props.navigator.pop();
    }

    render() {
        const button = this.state.isCodeFieldActive
            ? (<Button
                text="Next"
                loading={this.props.isConfirmCodeLoading}
                onPress={this.handleCodeSubmit} />)
            : (<Button
                text="Get Code"
                loading={this.props.isGetCodeLoading}
                onPress={this.handlePhoneSubmit} />);

        return (
            <View style={styles.main}>
                <Navigation
                    navTitle="Your Phone"
                    leftButtonTitle="Back"
                    leftHandler={this.handleBackButton} />
                <View style={styles.container}>
                    <View style={styles.formGroup}>
                        <TextField
                            wrapperStyle={styles.preTextField}
                            textAlign="center"
                            editable={false}
                            defaultValue="+1" />
                        <TextField
                            wrapperStyle={styles.textField}
                            placeholder="Your phone number"
                            keyboardType="phone-pad"
                            value={this.state.phone}
                            onChangeText={this.handlePhoneChange}
                            onFocus={this.handlePhoneFocus}
                            autoFocus />
                    </View>
                    <Animated.View style={[{ height: this.state.codeFieldHeight }, styles.formGroup]}>
                        <TextField
                            wrapperStyle={styles.preTextField}
                            textAlign="center"
                            editable={false}
                            defaultValue="C-" />
                        <TextField
                            ref={(el) => { this.codeField = el; }}
                            wrapperStyle={styles.textField}
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

function mapStateToProps(state) {
    return {
        login: state.user,
        isGetCodeLoading: state.ui.asyncStates.GENERATE_CODE,
        isConfirmCodeLoading: state.ui.asyncStates.CODE_CONFIRM
    };
}

export default connect(mapStateToProps, { registerDeviceToken, generateCode, confirmCode })(PhoneView);
