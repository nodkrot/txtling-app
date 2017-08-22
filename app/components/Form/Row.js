import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

export default React.createClass({
    propTypes: {
        rowStyle: PropTypes.any,
        rowTextStyle: PropTypes.any,
        text: PropTypes.string,
        subText: PropTypes.string
    },

    render() {
        let SubText = this.props.subText
            ? <Text style={styles.rowButtonSubText}>{this.props.subText}</Text> : null;

        return (
            <View style={[styles.rowButton, this.props.rowStyle]}>
                <View>
                    <Text style={[styles.rowButtonText, this.props.rowTextStyle]}>
                        {this.props.text}
                    </Text>
                    {SubText}
                </View>
            </View>
        );
    }
});
