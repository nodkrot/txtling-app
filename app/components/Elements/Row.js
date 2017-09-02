import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styles from './styles';

export default class Row extends Component {
    static displayName = 'Row'

    static propTypes = {
        rowStyle: PropTypes.any,
        rowTextStyle: PropTypes.any,
        text: PropTypes.string,
        subText: PropTypes.string
    }

    render() {
        const SubText = this.props.subText
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
}
