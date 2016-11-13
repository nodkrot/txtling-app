import styles, { buttonIconColor } from './styles';

import React, { PropTypes } from 'react';
import { Text, TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default React.createClass({

    displayName: 'Button',

    propTypes: {
        icon: PropTypes.string,
        onPress: PropTypes.func,
        style: PropTypes.any,
        text: PropTypes.string.isRequired
    },

    maybeRenderIcon() {
        if (this.props.icon) {
            return (
                <Icon
                    name={this.props.icon}
                    size={18}
                    color={buttonIconColor}
                    style={styles.buttonIcon} />);
        }

        return false;
    },

    render() {
        const buttonStyle = [styles.button, this.props.style];

        return (
            <TouchableOpacity style={buttonStyle} onPress={this.props.onPress} activeOpacity={0.6}>
                <Text style={styles.buttonText}>{this.props.text}</Text>
                {this.maybeRenderIcon()}
            </TouchableOpacity>
        );
    }
});
