import React, { Component, PropTypes } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles, { whiteColor } from './styles';

export default class extends Component {
    static displayName = 'Button'

    static propTypes = {
        icon: PropTypes.string,
        loading: PropTypes.bool,
        onPress: PropTypes.func,
        style: PropTypes.any,
        text: PropTypes.string.isRequired
    }

    maybeRenderIcon = () => {
        if (this.props.icon) {
            return (
                <Icon
                    name={this.props.icon}
                    size={18}
                    color={whiteColor}
                    style={styles.buttonIcon} />);
        }

        return false;
    }

    render() {
        const buttonStyle = [styles.button, this.props.style];

        if (this.props.loading) {
            return (
                <TouchableOpacity
                    style={[buttonStyle, styles.disabledButton]}
                    onPress={this.props.onPress}
                    activeOpacity={0.6}>
                    <ActivityIndicator color={whiteColor} />
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity style={buttonStyle} onPress={this.props.onPress} activeOpacity={0.6}>
                <Text style={styles.buttonText}>{this.props.text}</Text>
                {this.maybeRenderIcon()}
            </TouchableOpacity>
        );
    }
}
