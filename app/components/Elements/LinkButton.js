import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles, { darkerGreyColor } from './styles';

export default class LinkButton extends Component {
    static displayName = 'LinkButton'

    static propTypes = {
        icon: PropTypes.string,
        onPress: PropTypes.func,
        style: PropTypes.any,
        text: PropTypes.string.isRequired
    }

    state = {
        icon: 'ios-ionic'
    }

    render() {
        const linkButtonStyle = [styles.linkButton, this.props.style];

        return (
            <TouchableOpacity style={linkButtonStyle} onPress={this.props.onPress}>
                <Text style={styles.linkButtonText}>{this.props.text}</Text>
                <Icon
                    name={this.props.icon}
                    size={18}
                    color={darkerGreyColor}
                    style={styles.linkButtonIcon} />
            </TouchableOpacity>
        );
    }
}
