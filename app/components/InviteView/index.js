import styles, { greyColor, darkGreyColor, greenColor } from './styles';

import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Linking,
    ListView,
    NativeModules,
    TouchableHighlight,
    InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Navigation from '../Navigation';
import { Button } from '../Elements';
import SearchListView from '../SearchListView';
import * as ContactsActions from '../../actions/ContactsActions';
import { INVITE_URL } from '../../constants/AppConstants.js';

const Composer = NativeModules.RNMessageComposer;

function searchFor(item, query) {
    const q = query.toLowerCase();

    return item.first_name.toLowerCase().indexOf(q) >= 0 ||
           item.last_name.toLowerCase().indexOf(q) >= 0;
}

class InviteView extends Component {

    constructor(props) {
        super(props);

        this.selectedContacts = [];

        this.state = {
            totalSelectedContact: 0,
            searchDataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        };

        this.renderRow = this.renderRow.bind(this);
        this.handleRowPress = this.handleRowPress.bind(this);
        this.handleInviteButton = this.handleInviteButton.bind(this);
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.getPhoneContacts().catch((err) => console.log(err)); // eslint-disable-line
        });
    }

    componentWillUnmount() {
        this.props.resetPhoneContacts();
    }

    handleRowPress(rowData) {
        this.props.toggleRow(rowData.phone_id);
        this.refs.searchWrapper.close();

        const index = this.selectedContacts.findIndex((contact) => contact.phone_id === rowData.phone_id);

        if (index >= 0) {
            this.selectedContacts.splice(index, 1);
        } else {
            this.selectedContacts.push(rowData);
        }

        this.setState({ totalSelectedContact: this.selectedContacts.length });
    }

    handleInviteButton() {
        if (this.selectedContacts.length < this.props.minInvitees) {
            return;
        }

        Composer.composeMessageWithArgs({
            messageText: `Hey, let\'s try Txtling: ${INVITE_URL}`,
            recipients: this.selectedContacts.map((contact) => contact.number)
        }, (result) => {
            switch (result) {
                case Composer.Sent:
                    if (this.props.onAfterInvite) {
                        this.props.onAfterInvite(result);
                    }
                    // console.log('the message has been sent');
                    break;
                case Composer.Cancelled:
                    console.log('user cancelled sending the message');
                    break;
                case Composer.Failed:
                    console.log('failed to send the message');
                    break;
                case Composer.NotSupported:
                    console.log('this device does not support sending texts');
                    break;
                default:
                    console.log('something unexpected happened');
                    break;
            }
        });
    }

    renderRow(rowData) {
        const isSelected = this.props.phoneContactIds[rowData.phone_id].selected;
        const icon = isSelected ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline';

        return (
            <TouchableHighlight onPress={() => this.handleRowPress(rowData)} underlayColor={greyColor}>
                <View style={styles.row}>
                    <Icon
                        name={icon}
                        size={22}
                        color={greenColor}
                        style={styles.rowCheckIcon} />
                    <View>
                        <Text style={styles.text}>{`${rowData.first_name} ${rowData.last_name}`}</Text>
                        <Text style={styles.subText}>{rowData.number}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const cancelProps = {};

        if (this.props.onCancel) {
            cancelProps.leftButtonTitle = 'Back';
            cancelProps.leftHandler = this.props.onCancel;
        }

        const navigation = (
            <Navigation
                navTitle="Invite Friends"
                rightButtonTitle="Search"
                rightHandler={() => this.refs.searchWrapper.open()}
                {...cancelProps} />
        );

        if (!this.props.allowAccessContacts) {
            return (
                <View style={styles.main}>
                    {navigation}
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
                {navigation}
                <SearchListView
                    ref="searchWrapper"
                    dataSet={this.props.contacts}
                    renderRow={this.renderRow}
                    searchRow={searchFor}>
                    <ListView
                        dataSource={this.props.dataSource}
                        renderRow={this.renderRow} />
                </SearchListView>
                <View>
                    <TouchableHighlight
                        onPress={this.handleInviteButton}
                        style={{ backgroundColor: greyColor }}
                        activeOpacity={1}
                        underlayColor={darkGreyColor}>
                        <View style={styles.inviteButton}>
                            <View style={styles.buttonCounter}>
                                <Text style={styles.buttonCounterText}>
                                    {this.state.totalSelectedContact}
                                </Text>
                            </View>
                            <Text style={styles.inviteButtonText}>{'Invite to Txtling'}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

InviteView.propTypes = {
    allowAccessContacts: PropTypes.bool.isRequired,
    contacts: PropTypes.array.isRequired,
    dataSource: PropTypes.object.isRequired,
    getPhoneContacts: PropTypes.func.isRequired,
    minInvitees: PropTypes.number,
    onAfterInvite: PropTypes.func,
    onCancel: PropTypes.func,
    phoneContactIds: PropTypes.object.isRequired,
    resetPhoneContacts: PropTypes.func.isRequired,
    toggleRow: PropTypes.func.isRequired
};

InviteView.defaultProps = {
    minInvitees: 1
};

const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps(state) {
    return {
        dataSource: dataSource.cloneWithRows(state.Contacts.phoneContacts),
        allowAccessContacts: state.Contacts.allowAccessContacts,
        phoneContactIds: state.Contacts.phoneContactIds,
        contacts: state.Contacts.phoneContacts
    };
}

export default connect(mapStateToProps, ContactsActions)(InviteView);
