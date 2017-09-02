import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import styles, { tintColor, titleTintColor } from './styles';

const iconMap = {
    Settings: 'ios-settings',
    Search: 'ios-search',
    Back: 'ios-arrow-back'
};

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
        let leftButton;
        let rightButton;

        if (this.props.leftButtonTitle) {
            leftButton = (
                <TouchableOpacity onPress={this.props.leftHandler}>
                    <Icon name={iconMap[this.props.leftButtonTitle]} size={34} style={styles.icon} />
                </TouchableOpacity>
            );
        }

        if (this.props.rightButtonTitle) {
            rightButton = (
                <TouchableOpacity onPress={this.props.rightHandler}>
                    <Icon name={iconMap[this.props.rightButtonTitle]} size={30} style={styles.icon} />
                </TouchableOpacity>
            );
        }

        const navProps = {
            tintColor,
            title: {
                title: this.props.navTitle,
                tintColor: titleTintColor
            },
            statusBar: {
                style: 'light-content',
                hidden: false
            },
            leftButton,
            rightButton
        };

        return <NavigationBar {...navProps} />;
    }
}
