import React, { PropTypes } from 'react';
import { TextInput, View, InteractionManager } from 'react-native';
import styles, { primaryColor, greyColor } from './styles';

export default class extends React.Component {
    static displayName = 'TextField'

    static propTypes = {
        autoFocus: PropTypes.bool,
        style: TextInput.propTypes.style,
        wrapperStyle: View.propTypes.style,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func
    }

    state = {
        isFocused: Boolean(this.props.autoFocus)
    }

    focus = () => {
        InteractionManager.runAfterInteractions(() => this.field.focus());
    }

    onFocus = (e) => {
        this.setState({ isFocused: true });
        if (this.props.onFocus) this.props.onFocus(e);
    }

    onBlur = (e) => {
        this.setState({ isFocused: false });
        if (this.props.onBlur) this.props.onBlur(e);
    }

    render() {
        const borderColor = this.state.isFocused ? primaryColor : greyColor;
        return (
            <View style={[styles.textInputWrapper, { borderBottomColor: borderColor }, this.props.wrapperStyle]}>
                <TextInput
                    {...this.props}
                    ref={(el) => { this.field = el; }}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    style={[styles.textInput, this.props.style]} />
            </View>
        );
    }
}
