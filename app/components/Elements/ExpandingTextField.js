import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';
import styles from './styles';

const INPUT_LINE_HEIGHT = 35;

export default class ExpandingTextField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.defaultValue,
            height: INPUT_LINE_HEIGHT
        };

        this.clearInput = this.clearInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    clearInput() {
        this.refs.textInput.setNativeProps({ text: '' });
        this.setState({ height: INPUT_LINE_HEIGHT });
    }

    handleChange(event) {
        this.setState({
            text: event.nativeEvent.text,
            height: event.nativeEvent.contentSize.height
        });
    }

    render() {
        const textInputStyles = [
            styles.expandingTextField,
            this.props.style,
            { height: Math.max(INPUT_LINE_HEIGHT, this.state.height) }
        ];

        return (
            <TextInput
                {...this.props}
                ref="textInput"
                multiline
                onChange={this.handleChange}
                style={textInputStyles}
                value={this.state.text}
            />
        );
    }
}

ExpandingTextField.propTypes = {
    defaultValue: PropTypes.any,
    style: PropTypes.any
};

ExpandingTextField.defaultProps = {
    style: {}
};
