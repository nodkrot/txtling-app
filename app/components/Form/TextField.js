import React, { PropTypes } from 'react';
import { TextInput, View, InteractionManager } from 'react-native';
import styles, { primaryColor, greyColor } from './styles';

export default class extends React.Component {
    static displayName = 'TextField'

    static propTypes = {
        focused: PropTypes.bool,
        style: PropTypes.object,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func
    }

    static defaultProps = {
        focused: false
    }

    state = {
        isFocused: this.props.focused
    }

    componentDidMount() {
        if (this.props.focused) {
            this.focus();
        }
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
            <View style={[styles.textInputWrapper, { borderBottomColor: borderColor }, this.props.style]}>
                <TextInput
                    {...this.props}
                    ref={(el) => { this.field = el; }}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    style={styles.textInput} />
            </View>
        );
    }
}
