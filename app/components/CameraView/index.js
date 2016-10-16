import styles from './styles';

import React, { Component, PropTypes } from 'react';
import {
    TouchableHighlight,
    View,
    Text
} from 'react-native';
// import { connect } from 'react-redux';
import Camera from 'react-native-camera';
// react-native-camera IS REMOVED DUE TO ISSUES WITH MIGRATION
// https://github.com/lwansbrough/react-native-camera/issues/386


class CameraView extends Component {

    constructor() {
        super();

        this.state = {
            cameraType: Camera.constants.Type.front
        };

        this.handleSwitchCamera = this.handleSwitchCamera.bind(this);
        this.handleTakePicture = this.handleTakePicture.bind(this);
    }

    handleSwitchCamera() {
        const state = this.state;
        state.cameraType = state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back;
        this.setState(state);
    }

    handleTakePicture() {
        this.refs.cam.capture((err, data) => {
            console.log(err, data);
        });
    }

    render() {
        return (
            <View style={styles.main}>
                <Camera
                    ref="cam"
                    style={styles.cameraWrapper}
                    type={this.state.cameraType}>
                    <TouchableHighlight onPress={this.handleSwitchCamera}>
                      <Text>The old switcheroo</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.handleTakePicture}>
                      <Text>Take Picture</Text>
                    </TouchableHighlight>
                </Camera>
            </View>
        );
    }
}

// CameraView.propTypes = {
//     total: PropTypes.string,
//     checkout: PropTypes.func.isRequired
// };

function mapStateToProps(state) {
    return {};
}

export default CameraView;
// export default connect(mapStateToProps, {})(CameraView);
