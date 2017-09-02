import React, { Component, PropTypes } from 'react';
import {
    View,
    Image,
    ScrollView,
    CameraRoll,
    TouchableHighlight,
    NativeModules
} from 'react-native';
import Dimensions from 'Dimensions';
import styles from './styles';

const thumbSize = Dimensions.get('window').width / 4;


export default class CameraRollView extends Component {
    static displayName = 'CameraRollView'

    static propTypes = {
        onImageSelect: PropTypes.func.isRequired
    }

    state = {
        images: []
    }

    componentDidMount() {
        const fetchParams = {
            first: 25
        };

        CameraRoll.getPhotos(fetchParams, this.storeImages, (err) => console.log(err));
    }

    storeImages = (data) => {
        const assets = data.edges;
        const images = assets.map((asset) => asset.node.image);

        this.setState({ images });
    }

    handleImageSelect = (uri) => {
        NativeModules.ReadImageData.readImage(uri, (image) => {
            this.props.onImageSelect(uri, image);
        });
    }

    renderImageThumbs = () => {
        return this.state.images.map((image, i) => {
            return (
                <TouchableHighlight key={i} onPress={() => this.handleImageSelect(image.uri)}>
                    <Image source={{ uri: image.uri }} style={{ width: thumbSize, height: thumbSize }} />
                </TouchableHighlight>
            );
        });
    }

    render() {
        return (
            <View style={styles.main}>
                <ScrollView>
                    <View style={styles.imageGrid}>
                        {this.renderImageThumbs()}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
