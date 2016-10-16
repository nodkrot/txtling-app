import styles, { primaryColor, whiteColor } from './styles';

import React, { PropTypes } from 'react';
import { Text } from 'react-native';
import { merge, isArray } from 'lodash';
import { MKButton } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/Ionicons';

function mergeArrays(a, b) {
    if (isArray(a)) {
        return a.concat(b);
    }
}

export default React.createClass({
    propTypes: {
        icon: PropTypes.string,
        iconLeft: PropTypes.bool,
        iconRight: PropTypes.bool,
        onPress: PropTypes.func,
        style: PropTypes.object,
        text: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['colored', 'flat'])
    },

    getDefaultProps() {
        return {
            type: 'colored',
            iconLeft: false,
            iconRight: false,
            icon: 'ios-ionic'
        };
    },

    renderIcon() {
        return (
            <Icon
                name={this.props.icon}
                size={14}
                color={this.props.type === 'colored' ? whiteColor : primaryColor}
                style={styles.icon} />
        );
    },

    render() {
        const buttonProps = merge(MKButton[`${this.props.type}Button`]().toProps(), {
            style: [styles.button, this.props.style],
            onPress: this.props.onPress
        }, mergeArrays);

        const buttonTextProps = {
            pointerEvents: 'none',
            style: styles[`${this.props.type}ButtonText`]
        };

        if (this.props.iconLeft) {
            return (
                <MKButton {...buttonProps}>
                    {this.renderIcon()}
                    <Text {...buttonTextProps}>
                        {this.props.text}
                    </Text>
                </MKButton>
            );
        } else if (this.props.iconRight) {
            return (
                <MKButton {...buttonProps}>
                    <Text {...buttonTextProps}>
                        {this.props.text}
                    </Text>
                    {this.renderIcon()}
                </MKButton>
            );
        } else {
            return (
                <MKButton {...buttonProps}>
                    <Text {...buttonTextProps}>
                        {this.props.text}
                    </Text>
                </MKButton>
            );
        }
    }
});
