import React, { Component, PropTypes } from 'react';
import {
    // TouchableHighlight,
    // Modal,
    // Text,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { registerUser } from '../../redux/user';
import Navigation from '../Navigation';
import { Button } from '../Elements';
import { TextField } from '../Form';
import { ROUTES } from '../../constants/AppConstants';
// import CameraView from '../CameraView';
// import CameraRollView from '../CameraRollView';
import styles from './styles';

class InfoView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            animated: true,
            modalVisible: false,
            transparent: false
        };

        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        // this.handleCameraPress = this.handleCameraPress.bind(this);
        // this.handleModalDismiss = this.handleModalDismiss.bind(this);
        // this.handleImageSelect = this.handleImageSelect.bind(this);
    }

    handleFirstNameChange(firstName) {
        this.setState({ firstName });
    }

    handleLastNameChange(lastName) {
        this.setState({ lastName });
    }

    handleButtonPress() {
        this.props.registerUser({
            first_name: this.state.firstName,
            last_name: this.state.lastName
        }).then(() => {
            this.props.navigator.push({
                id: ROUTES.languagesView
            });
        });
    }

    handleBackButton() {
        this.props.navigator.pop();
    }

    // TODO: Add camera view to the router
    // handleCameraPress() {
    //     this.setState({ modalVisible: true });

    //     // this.props.navigator.push({
    //     //     title: 'Camera View',
    //     //     component: CameraView,
    //     //     sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    //     // });
    // }

    // handleImageSelect() {
    //     this.props.uploadImage();
    // }

    handleModalDismiss() {
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
                        value={this.state.firstName}
                        onChangeText={this.handleFirstNameChange}
                        autoCorrect={false}
                        autoFocus />
                    <TextField
                        placeholder="Last Name"
                        onChangeText={this.handleLastNameChange}
                        autoCorrect={false}
                        value={this.state.lastName} />
                    <Button
                        text="Next"
                        onPress={this.handleButtonPress} />
                </View>
            </View>
        );
    }
}

/*<View style={styles.info}>
    <View style={styles.picture}>
        <TouchableHighlight onPress={this.handleCameraPress} underlayColor="transparent">
            <View style={styles.cameraButton}>
                <Text style={styles.cameraButtonText}>add photo</Text>
            </View>
        </TouchableHighlight>
    </View>
    <View style={styles.name}>
        <TextField
            placeholder="First Name"
            value={this.state.firstName}
            autoCorrect={false}
            autoFocus />
        <TextField
            placeholder="Last Name"
            autoCorrect={false}
            value={this.state.lastName} />
    </View>
</View>*/

/* <Modal
    animated={this.state.animated}
    transparent={this.state.transparent}
    visible={this.state.modalVisible}>
    <View style={styles.main}>
        <Navigation
            navTitle="Choose Image"
            leftButtonTitle="Cancel"
            leftHandler={this.handleModalDismiss} />
        <CameraRollView onImageSelect={this.handleImageSelect} />
    </View>
</Modal> */


InfoView.propTypes = {
    navigator: PropTypes.object,
    registerUser: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        login: state.user
    };
}

export default connect(mapStateToProps, {
    registerUser
})(InfoView);
