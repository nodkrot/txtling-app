import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { registerUser } from '../../redux/user';
import Navigation from '../Navigation';
import { Button, TextField } from '../Elements';
import { ROUTES } from '../../constants/AppConstants';
import styles from './styles';

class InfoView extends Component {
    static displayName = 'InfoView'

    static propTypes = {
        navigator: PropTypes.object,
        registerUser: PropTypes.func.isRequired,
        isRegisteringUser: PropTypes.bool
    }

    state = {
        firstName: '',
        lastName: '',
        animated: true,
        modalVisible: false,
        transparent: false
    }

    handleFirstNameChange = (firstName) => {
        this.setState({ firstName });
    }

    handleLastNameChange = (lastName) => {
        this.setState({ lastName });
    }

    handleButtonPress = () => {
        this.props.registerUser({
            first_name: this.state.firstName,
            last_name: this.state.lastName
        }).then(() => {
            this.props.navigator.push({
                id: ROUTES.languagesView
            });
        });
    }

    handleBackButton = () => {
        this.props.navigator.pop();
    }

    handleModalDismiss = () => {
        this.setState({ modalVisible: false });
    }

    render() {
        return (
            <View style={styles.main}>
                <Navigation
                    navTitle="Your Info"
                    leftButtonTitle="Back"
                    leftHandler={this.handleBackButton} />
                <View style={styles.container}>
                    <TextField
                        placeholder="First Name"
                        wrapperStyle={styles.textField}
                        value={this.state.firstName}
                        onChangeText={this.handleFirstNameChange}
                        autoCorrect={false}
                        autoFocus />
                    <TextField
                        placeholder="Last Name"
                        wrapperStyle={styles.textField}
                        onChangeText={this.handleLastNameChange}
                        autoCorrect={false}
                        value={this.state.lastName} />
                    <Button
                        text="Next"
                        loading={this.props.isRegisteringUser}
                        onPress={this.handleButtonPress} />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        login: state.user,
        isRegisteringUser: state.ui.asyncStates.REGISTER_USER
    };
}

export default connect(mapStateToProps, { registerUser })(InfoView);
