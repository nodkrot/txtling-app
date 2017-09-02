import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableHighlight
} from 'react-native';
import Row from './Row';
import { greyColor } from './styles';

export default class RowButton extends Component {
    static displayName = 'RowButton'

    static propTypes = {
        onPress: PropTypes.func,
        rowStyle: PropTypes.any,
        rowTextStyle: PropTypes.any,
        text: PropTypes.string
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor={greyColor}>
                <View>
                    <Row {...this.props} />
                </View>
            </TouchableHighlight>
        );
    }
}
