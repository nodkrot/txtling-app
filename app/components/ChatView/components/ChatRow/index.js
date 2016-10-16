import styles, {
    soundIconColor,
    bubbleRightPressColor,
    bubbleLeftPressColor
} from './styles';

import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ChatRow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            toValue: 0,
            bubbleHeight: new Animated.Value(0)
        };

        this.handleSoundPress = this.handleSoundPress.bind(this);
        this.handleBubblePress = this.handleBubblePress.bind(this);
        this.handleBubbleLayout = this.handleBubbleLayout.bind(this);
    }

    animateBubbleTextHeight(toValue, duration) {
        return new Promise((resolve) => {
            Animated.timing(
                this.state.bubbleHeight,
                { toValue, duration }
            ).start(() => {
                resolve();
            });
        });
    }

    handleBubbleLayout(event) {
        const { height } = event.nativeEvent.layout;

        this.setState({ toValue: height });
    }

    handleBubblePress() {
        if (this.state.isOpen) {
            this.animateBubbleTextHeight(0, 225);
        } else {
            this.animateBubbleTextHeight(this.state.toValue, 225);
        }

        this.setState({ isOpen: !this.state.isOpen });

        if (this.props.onPress) {
            this.props.onPress(this.props.data);
        }
    }

    handleSoundPress() {
        if (this.props.isSound && this.props.onSoundPress) {
            this.props.onSoundPress(this.props.data);
        }
    }

    renderSoundIcon() {
        if (!this.props.isSound) {
            return null;
        }

        return (
            <TouchableOpacity
                onPress={this.handleSoundPress}
                style={styles.soundIcon}>
                <Icon
                    name="md-volume-up"
                    size={20}
                    color={soundIconColor} />
            </TouchableOpacity>
        );
    }

    render() {
        const date = new Date(this.props.data.timestamp);
        const hours = `0${date.getHours()}`.slice(-2);
        const minutes = `0${date.getMinutes()}`.slice(-2);
        const formattedTimestamp = `${hours}:${minutes}`;
        const chatRowStyles = this.props.isMe ? styles.chatRowRight : styles.chatRowLeft;
        const bubbleStyles = this.props.isMe ? styles.bubbleRight : styles.bubbleLeft;
        const pressColor = this.props.isMe ? bubbleRightPressColor : bubbleLeftPressColor;
        const bubbleText = this.props.isMe ? styles.rightBubbleText : styles.leftBubbleText;
        const bubbleSubText = this.props.isMe ? styles.rightBubbleSubText : styles.leftBubbleSubText;

        return (
            <View style={chatRowStyles}>
                <View style={styles.bubbleWrapper}>
                    {this.props.isMe && this.renderSoundIcon()}
                    <TouchableHighlight onPress={this.handleBubblePress} underlayColor={pressColor} style={bubbleStyles}>
                        <View>
                            <Text style={[bubbleText, styles.bubbleText]}>{this.props.data.translated_message}</Text>
                            <Animated.View style={[{ height: this.state.bubbleHeight }, styles.animatedBubbleText]}>
                                <View style={styles.bubbleSubTextWrapper} onLayout={this.handleBubbleLayout}>
                                    <Text style={[bubbleSubText, styles.bubbleText]}>{this.props.data.message}</Text>
                                </View>
                            </Animated.View>
                        </View>
                    </TouchableHighlight>
                    {!this.props.isMe && this.renderSoundIcon()}
                </View>
                <View style={styles.chatInfo}>
                    <Text style={styles.timestamp}>{formattedTimestamp}</Text>
                </View>
            </View>
        );
    }
}

ChatRow.propTypes = {
    data: PropTypes.object.isRequired,
    isMe: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    isSound: PropTypes.bool,
    onPress: PropTypes.func,
    onSoundPress: PropTypes.func
};
