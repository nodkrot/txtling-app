import styles from './styles';

import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';

export default React.createClass({
    propTypes: {
        rowStyle: PropTypes.any,
        rowTextStyle: PropTypes.any,
        text: PropTypes.string
    },

    render() {
        return (
            <View style={[styles.rowButton, this.props.rowStyle]}>
                <Text style={[styles.rowButtonText, this.props.rowTextStyle]}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
});
