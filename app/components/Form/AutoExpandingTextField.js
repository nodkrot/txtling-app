import React, { Component, PropTypes } from 'react';
import { TextInput } from 'react-native';
import styles from './styles';

const INPUT_LINE_HEIGHT = 35;

export default class AutoExpandingTextField extends Component {

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
            styles.autoExpandingTextField,
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

AutoExpandingTextField.propTypes = {
    defaultValue: PropTypes.any,
    style: PropTypes.any
};

AutoExpandingTextField.defaultProps = {
    style: {}
};
