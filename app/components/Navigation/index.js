import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavigationBar from 'react-native-navbar';
import {
    tintColor,
    titleTintColor,
    leftTintColor,
    rightTintColor
} from './styles';

export default class Navigation extends Component {
    static displayName = 'Navigation'

    static propTypes = {
        leftButtonTitle: PropTypes.string,
        leftHandler: PropTypes.func,
        navTitle: PropTypes.string,
        rightButtonTitle: PropTypes.string,
        rightHandler: PropTypes.func
    }

    static defaultProps = {
        navTitle: 'Hello World',
        leftButtonTitle: '',
        rightButtonTitle: ''
    }

    render() {
        const props = {
            tintColor,
            title: {
                title: this.props.navTitle,
                tintColor: titleTintColor
            },
            leftButton: {
                title: this.props.leftButtonTitle,
                handler: this.props.leftHandler,
                tintColor: leftTintColor
            },
            rightButton: {
                title: this.props.rightButtonTitle,
                handler: this.props.rightHandler,
                tintColor: rightTintColor
            },
            statusBar: {
                style: 'light-content',
                hidden: false
            },
            ...this.props
        };

        return (
            <NavigationBar {...props} />
        );
    }
}
