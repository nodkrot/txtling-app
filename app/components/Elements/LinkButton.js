import styles, { linkButtonIconColor } from './styles';

import React, { PropTypes } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default React.createClass({

    displayName: 'LinkButton',

    propTypes: {
        icon: PropTypes.string,
        onPress: PropTypes.func,
        style: PropTypes.any,
        text: PropTypes.string.isRequired
    },

    getDefaultProps() {
        return {
            icon: 'ios-ionic'
        };
    },

    render() {
        const linkButtonStyle = [styles.linkButton, this.props.style];

        return (
            <TouchableOpacity style={linkButtonStyle} onPress={this.props.onPress}>
                <Text style={styles.linkButtonText}>{this.props.text}</Text>
                <Icon
                    name={this.props.icon}
                    size={18}
                    color={linkButtonIconColor}
                    style={styles.linkButtonIcon} />
            </TouchableOpacity>
        );
    }
});
