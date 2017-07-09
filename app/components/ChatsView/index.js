import styles, { activeColor } from './styles';

import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Image,
    ListView,
    TouchableHighlight
} from 'react-native';
import Navigation from '../Navigation';
import { Button } from '../Elements';
import { ROUTES } from '../../constants/AppConstants';
import { getInitials } from '../../utilities';
import { getChats } from '../../redux/chat';
import { connect } from 'react-redux';

class ChatsView extends Component {

    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.handleRowPress = this.handleRowPress.bind(this);
        this.handleInvitePress = this.handleInvitePress.bind(this);
    }

    componentWillMount() {
        this.props.getChats();
    }

    handleRowPress(rowData, opponent) {
        this.props.navigator.push({
            id: ROUTES.chatView,
            passProps: {
                groupId: rowData._id,
                navTitle: opponent.first_name
            }
        });
    }

    handleInvitePress() {
        this.props.navigator.push({
            id: ROUTES.inviteView,
            passProps: {
                onCancel: () => this.props.navigator.pop(),
                onAfterInvite: () => this.props.navigator.pop()
            }
        });
    }

    renderRow(rowData) {
        const opponent = rowData.persons.filter((p) => p._id !== this.props.user._id)[0];

        if (!opponent) {
            return false;
        }

        const initials = (
            <View style={styles.initials}>
                <Text style={styles.initialsText}>{getInitials(opponent.first_name, opponent.last_name)}</Text>
            </View>
        );
        const badgeNumber = (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{rowData.badges}</Text>
            </View>
        );

        const flagImg = `http://txtling.herokuapp.com/img/flat-flags/${rowData.learn_lang_code}.png`;
        // <Text style={styles.rowInfoContent}>{rowData.lastMessage}</Text>

        return (
            <TouchableHighlight onPress={() => this.handleRowPress(rowData, opponent)} underlayColor={activeColor}>
                <View style={styles.row}>
                    {initials}
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
        if (!this.props.chats.length) {
            return (
                <View style={styles.main}>
                    <Navigation navTitle="Chats" />
                    <Text style={styles.noChats}>No chats yet.</Text>
                    <Button
                        text="Invite Friends"
                        style={{ margin: 16 }}
                        onPress={this.handleInvitePress} />
                </View>
            );
        }

        return (
            <View style={styles.main}>
                <Navigation navTitle="Chats" />
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

ChatsView.propTypes = {
    chats: PropTypes.array,
    dataSource: PropTypes.object.isRequired,
    getChats: PropTypes.func.isRequired,
    navigator: PropTypes.object,
    user: PropTypes.object
};

const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps(state) {
    return {
        user: state.Login,
        chats: state.chats.allChats,
        dataSource: dataSource.cloneWithRows(state.chats.allChats)
    };
}

export default connect(mapStateToProps, { getChats })(ChatsView);
