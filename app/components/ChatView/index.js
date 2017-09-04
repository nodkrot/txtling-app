import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    LayoutAnimation,
    View,
    Text,
    ListView,
    Keyboard,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import Speech from 'react-native-speech';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Firebase from 'firebase';
import 'firebase-util';
import firebaseRef from '../../firebase/database';
import Tracker from '../../utilities/tracker';
import { getScrollOffset } from '../../utilities';
import { ROUTES } from '../../constants/AppConstants';
import Navigation from '../Navigation';
import { ExpandingTextField } from '../../components/Elements';
import ChatRow from './components/ChatRow';
import { clearNewMessage, updateNewMessage, clearChatBadges } from '../../redux/chat';

import styles from './styles';

const VOICE_LANG_CODES = ['ar-SA', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-IE', 'en-US', 'en-ZA', 'es-ES', 'es-MX', 'fi-FI', 'fr-CA', 'fr-FR', 'he-IL', 'hi-IN', 'hu-HU', 'id-ID', 'it-IT', 'ja-JP', 'ko-KR', 'nl-BE', 'nl-NL', 'no-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK', 'sv-SE', 'th-TH', 'tr-TR', 'zh-CN', 'zh-HK', 'zh-TW']
    .reduce((acc, code) => {
        acc[code.substring(0, 2)] = code;
        return acc;
    }, {});

const animations = {
    layout: {
        spring: {
            duration: 400,
            create: {
                duration: 300,
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity
            },
            update: {
                type: LayoutAnimation.Types.spring,
                springDamping: 400
            }
        },
        easeInEaseOut: {
            duration: 400,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.scaleXY
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut
            }
        }
    }
};

class ChatView extends Component {
    static displayName = 'ChatView'

    static propTypes = {
        newMessageText: PropTypes.object.isRequired,
        clearNewMessage: PropTypes.func.isRequired,
        clearChatBadges: PropTypes.func.isRequired,
        updateNewMessage: PropTypes.func.isRequired,
        groupId: PropTypes.string.isRequired,
        navTitle: PropTypes.string.isRequired,
        navigator: PropTypes.object,
        user: PropTypes.object,
        chats: PropTypes.array.isRequired
    }

    state = {
        keyboardSpace: 0,
        distanceFromTop: 150,
        scrollEventThrottle: 200,
        messageDataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
    }

    componentDidMount() {
        this.messages = [];
        this.learnLanguage = '';
        this.isReceivingMoreMessages = false;
        this.handleTextChange = debounce(this.handleTextChange, 100);
        this.rawMessagesRef = firebaseRef.child('raw_messages');
        this.receiveRef = firebaseRef.child('txtling_messages').child(this.props.groupId);
        this.paginationRef = new Firebase.util.Paginate(this.receiveRef, '$priority', { pageSize: 15 });
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace);

        InteractionManager.runAfterInteractions(() => {
            this.receiveRef.on('child_added', this.receiveMessage);
            this.paginationRef.on('value', this.receiveMoreMessages);
            this.requestMoreMessages();

            // Somehow make a check to only call when has badges
            // May be set badges in the store on AppState and then get from there by groupId
            // Note: this will fetch all chats
            this.props.clearChatBadges(this.props.groupId).then(() => {
                const currentGroup = this.props.chats.find((chat) => chat._id === this.props.groupId);
                this.learnLanguage = currentGroup.learn_lang_code;
            });
        });
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();

        this.receiveRef.off();
        this.paginationRef.off();
    }

    updateMessageDataSource = (data) => {
        this.setState({ messageDataSource: this.state.messageDataSource.cloneWithRows(data) });
    }

    requestMoreMessages = () => {
        if (this.paginationRef.page.hasNext()) {
            this.isReceivingMoreMessages = true;
            this.paginationRef.page.next();
        }
    }

    receiveMoreMessages = (snap) => {
        if (!this.isReceivingMoreMessages) {
            return;
        }

        snap.forEach((s) => {
            this.messages.push(s.val());
        });

        this.updateMessageDataSource(this.messages);
        this.isReceivingMoreMessages = false;
    }

    receiveMessage = (snap) => {
        if (this.isReceivingMoreMessages) {
            return;
        }

        this.messages = [snap.val()].concat(this.messages);
        this.updateMessageDataSource(this.messages);
    }

    handlePressSend = () => {
        let message = '';

        if (this.props.groupId in this.props.newMessageText) {
            message = this.props.newMessageText[this.props.groupId].trim();
        }

        if (!message.length) {
            return;
        }

        this.rawMessagesRef.push({
            message,
            user_id: this.props.user._id,
            group_id: this.props.groupId,
            first_name: this.props.user.first_name,
            last_name: this.props.user.last_name,
            language: this.learnLanguage,
            timestamp: Firebase.ServerValue.TIMESTAMP
        });

        this.refs.chatTextInput.clearInput();
        this.props.clearNewMessage(this.props.groupId);

        Tracker.trackEvent('Chat', 'Send Message', {
            label: 'Message Length',
            value: message.length
        });
    }

    handleScroll = (event) => {
        if (getScrollOffset(event) < this.state.distanceFromTop) {
            this.requestMoreMessages();
        }
    }

    handleTextChange = (value) => {
        this.props.updateNewMessage(this.props.groupId, value);
    }

    handleSoundPress = (rowData) => {
        Speech.speak({
            text: rowData.translated_message,
            voice: VOICE_LANG_CODES[rowData.language],
            rate: 0.4
        });
    }

    handleBackButton = () => {
        this.props.navigator.pop();
    }

    handleSettingsButton = () => {
        Tracker.trackEvent('CTA', 'Chat Settings');

        this.props.navigator.push({
            id: ROUTES.chatSettingsView,
            passProps: {
                groupId: this.props.groupId,
                onComplete: (languageData) => {
                    const firstName = this.props.user.first_name;

                    this.receiveRef.push().setWithPriority({
                        type: 'info',
                        message: `${firstName} changed language of this chat to ${languageData.human_readable}`,
                        timestamp: Firebase.ServerValue.TIMESTAMP,
                        data: languageData // To support older versions of the app
                    }, 0 - Date.now());

                    this.learnLanguage = languageData.google_code;
                }
            }
        });
    }

    updateKeyboardSpace = (frames) => {
        LayoutAnimation.configureNext(animations.layout.spring);
        this.setState({ keyboardSpace: frames.endCoordinates.height });
    }

    resetKeyboardSpace = () => {
        LayoutAnimation.configureNext(animations.layout.spring);
        this.setState({ keyboardSpace: 0 });
    }

    renderRow = (rowData) => {
        const isMe = rowData.user_id === this.props.user._id;

        if (rowData.type === 'info') {
            return (
                <View style={styles.infoRow}>
                    <Text style={styles.infoRowText}>
                        {rowData.message}
                    </Text>
                </View>
            );
        }

        return (<ChatRow
            isMe={isMe}
            isOpen={false}
            data={rowData}
            isSound={rowData.language in VOICE_LANG_CODES}
            onSoundPress={this.handleSoundPress} />);
    }

    renderFooterBar = () => (
        <View style={styles.footerBar}>
            <ExpandingTextField
                ref="chatTextInput"
                style={styles.chatTextInput}
                placeholder="Start texting"
                defaultValue={this.props.newMessageText[this.props.groupId]}
                onChangeText={this.handleTextChange} />
            <TouchableOpacity onPress={this.handlePressSend}>
                <Text style={styles.sendButton}>Send</Text>
            </TouchableOpacity>
        </View>
    )

    render() {
        // dataSource={this.props.dataSource}
        return (
            <View style={styles.main}>
                <Navigation
                    navTitle={this.props.navTitle}
                    leftButtonTitle="Back"
                    leftHandler={this.handleBackButton}
                    rightButtonTitle="Settings"
                    rightHandler={this.handleSettingsButton} />
                <ListView
                    renderScrollComponent={(props) => (
                        <InvertibleScrollView {...props} inverted keyboardShouldPersistTaps />
                    )}
                    onScroll={this.handleScroll}
                    removeClippedSubviews={false}
                    scrollEventThrottle={this.state.scrollEventThrottle}
                    dataSource={this.state.messageDataSource}
                    renderRow={this.renderRow}
                    renderFooter={() => (<View style={styles.chatThreadHeader} />)} />
                {this.renderFooterBar()}
                <View style={{ height: this.state.keyboardSpace }} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        newMessageText: state.chats.newMessageText,
        user: state.user,
        chats: state.chats.allChats
    };
}

export default connect(mapStateToProps, {
    clearChatBadges,
    clearNewMessage,
    updateNewMessage
})(ChatView);
