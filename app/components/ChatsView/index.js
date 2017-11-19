import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    ListView,
    TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import Navigation from '../Navigation';
import { ROUTES, BASE_URL } from '../../constants/AppConstants';
import { getInitials } from '../../utilities';
import { getChats } from '../../redux/chat';
import Tracker from '../../utilities/tracker';
import styles, { activeColor } from './styles';

const parrotLogo = require('../../images/logo.png');

class ChatsView extends Component {
    static displayName = 'ChatsView'

    static propTypes = {
        chats: PropTypes.array,
        dataSource: PropTypes.object.isRequired,
        didFetchChats: PropTypes.bool.isRequired,
        getChats: PropTypes.func.isRequired,
        navigator: PropTypes.object,
        user: PropTypes.object
    }

    componentWillMount() {
        // this check is here because chats may have been fetched
        // in TabsView to update push notification badges
        if (!this.props.didFetchChats) {
            this.props.getChats();
        }
    }

    handleRowPress = (rowData, opponent) => {
        this.props.navigator.push({
            id: ROUTES.chatView,
            passProps: {
                groupId: rowData._id,
                navTitle: opponent.first_name
            }
        });
    }

    handleInvitePress = () => {
        Tracker.trackEvent('CTA', 'Invite to Chat');

        this.props.navigator.push({
            id: ROUTES.inviteView,
            passProps: {
                onCancel: () => this.props.navigator.pop(),
                onAfterInvite: () => this.props.navigator.pop()
            }
        });
    }

    renderRow = (rowData) => {
        const opponent = rowData.persons.filter((p) => p._id !== this.props.user._id)[0];
        const flagImg = `${BASE_URL}img/flat-flags/${rowData.learn_lang_code}.png`;

        if (!opponent) return null;

        const initials = rowData.type === 'bot'
            ? <Image source={parrotLogo} style={styles.parrotLogo} />
            : <Text style={styles.initialsText}>{getInitials(opponent.first_name, opponent.last_name)}</Text>;

        const badgeNumber = (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{rowData.badges}</Text>
            </View>
        );

        return (
            <TouchableHighlight onPress={() => this.handleRowPress(rowData, opponent)} underlayColor={activeColor}>
                <View style={styles.row}>
                    <View style={styles.initials}>{initials}</View>
                    <View style={styles.rowInfo}>
                        <Text style={styles.rowInfoTitle}>
                            {`${opponent.first_name} ${opponent.last_name}`}
                        </Text>
                        <View style={styles.language}>
                            <Image
                                source={{ uri: flagImg }}
                                style={styles.flagImage} />
                            <Text>{rowData.learn_lang}</Text>
                        </View>
                    </View>
                    {rowData.badges > 0 && badgeNumber}
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.main}>
                <Navigation
                    navTitle="Chats"
                    rightButtonTitle="Invite"
                    rightHandler={this.handleInvitePress} />
                <ListView
                    enableEmptySections
                    contentInset={{ bottom: 49 }}
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.props.dataSource}
                    renderRow={this.renderRow} />
            </View>
        );
    }
}

const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps(state) {
    return {
        user: state.user,
        chats: state.chats.allChats,
        dataSource: dataSource.cloneWithRows(state.chats.allChats),
        didFetchChats: state.chats.didFetchChats
    };
}

export default connect(mapStateToProps, { getChats })(ChatsView);
