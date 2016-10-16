import {
    tintColor,
    titleTintColor,
    leftTintColor,
    rightTintColor
} from './styles';

import React, { PropTypes, Component } from 'react';
import NavigationBar from 'react-native-navbar';

export default class Navigation extends Component {
    constructor() {
        super();
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

Navigation.propTypes = {
    leftButtonTitle: PropTypes.string,
    leftHandler: PropTypes.func,
    navTitle: PropTypes.string,
    rightButtonTitle: PropTypes.string,
    rightHandler: PropTypes.func
};

Navigation.defaultProps = {
    navTitle: 'Hello World',
    leftButtonTitle: '',
    rightButtonTitle: ''
};
