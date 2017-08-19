import styles, { activeColor, primaryColor } from './styles';

import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Linking,
    ListView,
    TouchableHighlight,
    InteractionManager
} from 'react-native';
import Navigation from '../Navigation';
import { RowButton } from '../Form';
import { createContacts, getContacts } from '../../redux/contacts.js';
import { createChat } from '../../redux/chat';
import { connect } from 'react-redux';
import { Button } from '../Elements';
import { ROUTES } from '../../constants/AppConstants';
import Icon from 'react-native-vector-icons/Ionicons';
import { getInitials } from '../../utilities';

// import SearchListView from '../SearchListView';

// function searchFor(item, query) {
//     const q = query.toLowerCase();

//     return item.first_name.toLowerCase().indexOf(q) >= 0 ||
//            item.last_name.toLowerCase().indexOf(q) >= 0;
// }

class ContactsView extends Component {

    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderRegisteredRow = this.renderRegisteredRow.bind(this);
        this.renderNonregisteredRow = this.renderNonregisteredRow.bind(this);
        this.handleRegisteredRowPress = this.handleRegisteredRowPress.bind(this);
        this.handleNonregisteredRowPress = this.handleNonregisteredRowPress.bind(this);
        this.handleInviteRowPress = this.handleInviteRowPress.bind(this);
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.createContacts();
        });
    }

    handleRegisteredRowPress(rowData) {
        // this.refs.searchWrapper.close();

        if (!rowData.group_id) {
            this.props.createChat({
                language: this.props.user.learn_language,
                invitees: [{
                    _id: rowData._id,
                    first_name: rowData.first_name,
                    last_name: rowData.last_name,
                    number: rowData.number
                }]
            }).then(({ value }) => {
                // Update contact with group_id
                // Can be done neater with normalizr
                this.props.getContacts();

                this.props.navigator.push({
                    id: ROUTES.chatView,
                    passProps: {
                        groupId: value[0]._id,
                        navTitle: rowData.first_name
                    }
                });
            }).catch((err) => console.log(err));
        } else {
            this.props.navigator.push({
                id: ROUTES.chatView,
                passProps: {
                    groupId: rowData.group_id,
                    navTitle: rowData.first_name
                }
            });
        }
    }

    handleNonregisteredRowPress(rowData) {
        this.props.navigator.push({
            id: ROUTES.contactView,
            passProps: { profile: rowData }
        });
    }

    handleInviteRowPress() {
        this.props.navigator.push({
            id: ROUTES.inviteView,
            passProps: {
                onCancel: () => this.props.navigator.pop(),
                onAfterInvite: () => this.props.navigator.pop()
            }
        });
    }

    renderRow(rowData, sectionId) {
        if (sectionId === 'registered') {
            return this.renderRegisteredRow(rowData);
        } else {
            return this.renderNonregisteredRow(rowData);
        }
    }

    renderRegisteredRow(rowData) {
        if (rowData._id === this.props.user._id) {
            return null;
        }

        const initials = (
            <View style={styles.initials}>
                <Text style={styles.initialsText}>{getInitials(rowData.first_name, rowData.last_name)}</Text>
            </View>
        );

        return (
            <TouchableHighlight onPress={() => this.handleRegisteredRowPress(rowData)} underlayColor={activeColor}>
                <View style={styles.row}>
                    {initials}
                    <Text style={styles.text}>
                        {`${rowData.first_name} ${rowData.last_name}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderNonregisteredRow(rowData) {
        return (
            <RowButton
                onPress={() => this.handleNonregisteredRowPress(rowData)}
                text={`${rowData.first_name} ${rowData.last_name}`}
                subText={rowData.number}
                rowStyle={styles.unregisteredRow} />
        );
    }

    renderSectionHeader(sectionData, sectionId) {
        if (sectionId === 'registered') {
            return null;
        }

        return (
            <View style={styles.section}>
                <Text style={styles.sectionText}>{sectionId}</Text>
            </View>
        );
    }

    renderHeader() {
        return (
            <TouchableHighlight onPress={this.handleInviteRowPress} underlayColor={activeColor}>
                <View style={styles.row}>
                    <Icon
                        name="ios-people"
                        size={26}
                        color={primaryColor}
                        style={styles.rowLinkIcon} />
                    <Text style={[styles.text, styles.rowLink]}>Invite Friends</Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const navProps = {
            navTitle: 'Contacts'
            // rightButtonTitle: 'Search',
            // rightHandler: () => this.refs.searchWrapper.open()
        };

        if (!this.props.allowAccessContacts) {
            return (
                <View style={styles.main}>
                    <Navigation {...navProps} />
                    <Text style={styles.contactsDenied}>
                        Please go to settings to allow Txtling access contacts.
                    </Text>
                    <Button
                        style={styles.contactsDeniedButton}
                        text="Go to settings"
                        onPress={() => Linking.openURL('app-settings:')} />
                </View>
            );
        }

        return (
            <View style={styles.main}>
                <Navigation {...navProps} />
                <ListView
                    contentInset={{ bottom: 49 }}
                    automaticallyAdjustContentInsets={false}
                    renderHeader={this.renderHeader}
                    dataSource={this.props.dataSource}
                    renderRow={this.renderRow}
                    renderSectionHeader={this.renderSectionHeader} />

            </View>
        );
    }
}

ContactsView.propTypes = {
    allowAccessContacts: PropTypes.bool.isRequired,
    createChat: PropTypes.func.isRequired,
    createContacts: PropTypes.func.isRequired,
    dataSource: PropTypes.object.isRequired,
    getContacts: PropTypes.func.isRequired,
    navigator: PropTypes.object,
    user: PropTypes.object.isRequired
};

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

function mapStateToProps(state) {
    const { contactsDataBlob, contactsSectionIds } = state.contacts;

    return {
        user: state.user,
        allowAccessContacts: state.contacts.allowAccessContacts,
        dataSource: dataSource.cloneWithRowsAndSections(contactsDataBlob, contactsSectionIds)
    };
}

export default connect(mapStateToProps, { createChat, createContacts, getContacts })(ContactsView);
