import React, { PropTypes } from 'react';
import {
    View,
    TouchableHighlight
} from 'react-native';
import Row from './Row';
import { greyColor } from './styles';

export default React.createClass({
    propTypes: {
        onPress: PropTypes.func,
        rowStyle: PropTypes.any,
        rowTextStyle: PropTypes.any,
        text: PropTypes.string
    },

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor={greyColor}>
                <View>
                    <Row {...this.props} />
                </View>
            </TouchableHighlight>
        );
    }
});
