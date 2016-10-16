import styles, { primaryColor } from './styles';

import React, { PropTypes } from 'react';
import { InteractionManager } from 'react-native';
import { MKTextField } from 'react-native-material-kit';

export default React.createClass({
    propTypes: {
        focused: PropTypes.bool,
        style: PropTypes.object
    },

    getDefaultProps() {
        return { focused: false };
    },

    componentDidMount() {
        if (this.props.focused) {
            this.focus();
        }
    },

    focus() {
        InteractionManager.runAfterInteractions(() => {
            this.refs.field.focus();
        });
    },

    render() {
        const props = {
            ...this.props,
            ref: 'field',
            highlightColor: primaryColor,
            style: [styles.textfieldWrapper, this.props.style],
            textInputStyle: styles.textfield
        };

        return (
            <MKTextField {...props} />
        );
    }
});
