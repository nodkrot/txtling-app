import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { getPhoneContacts, toggleRow, resetPhoneContacts } from '../../redux/contacts';
import { INVITE_URL } from '../../constants/AppConstants';
import Tracker from '../../utilities/tracker';
import styles, { greyColor, darkGreyColor, greenColor } from './styles';

const Composer = NativeModules.RNMessageComposer;

function searchFor(item, query) {
    const q = query.toLowerCase();

    return item.first_name.toLowerCase().indexOf(q) >= 0 ||
           item.last_name.toLowerCase().indexOf(q) >= 0;
}

class InviteView extends Component {
    static displayName = 'InviteView'

    static propTypes = {
        allowAccessContacts: PropTypes.bool.isRequired,
        contacts: PropTypes.array.isRequired,
        dataSource: PropTypes.object.isRequired,
        minInvitees: PropTypes.number,
        navTitle: PropTypes.string,
        onAfterInvite: PropTypes.func,
        onCancel: PropTypes.func,
        getPhoneContacts: PropTypes.func.isRequired,
        phoneContactIds: PropTypes.object.isRequired,
        resetPhoneContacts: PropTypes.func.isRequired,
        toggleRow: PropTypes.func.isRequired
    }

    static defaultProps = {
        navTitle: 'Invite Friends',
        minInvitees: 1
    }

    state = {
        totalSelectedContact: 0,
        searchDataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        })
    }

    selectedContacts = []

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.getPhoneContacts();
        });
    }

    componentWillUnmount() {
        this.props.resetPhoneContacts();
    }

    handleRowPress = (rowData) => {
        this.props.toggleRow(rowData.phone_id);
        this.searchWrapper.close();

        const index = this.selectedContacts.findIndex((contact) => contact.phone_id === rowData.phone_id);

        if (index >= 0) {
            this.selectedContacts.splice(index, 1);
        } else {
            this.selectedContacts.push(rowData);
        }

        this.setState({ totalSelectedContact: this.selectedContacts.length });
    }

    handleInviteButton = () => {
        if (this.selectedContacts.length < this.props.minInvitees) {
            return;
        }

        Tracker.trackEvent('CTA', 'Invite to Txtling', { label: 'Recipients', value: this.selectedContacts.length });

        Composer.composeMessageWithArgs({
            messageText: `Hey, let's try Txtling: ${INVITE_URL}`,
            recipients: this.selectedContacts.map((contact) => contact.number)
        }, (result) => {
            switch (result) {
                case Composer.Sent:
                    console.log('the message has been sent');
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

            if (this.props.onAfterInvite) {
                this.props.onAfterInvite(result);
            }
        });
    }

    renderRow = (rowData) => {
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
        const leftNavButtonProps = {
            leftButtonTitle: 'Skip',
            leftHandler: this.props.onAfterInvite
        };

        if (this.props.onCancel) {
            leftNavButtonProps.leftButtonTitle = 'Back';
            leftNavButtonProps.leftHandler = this.props.onCancel;
        }

        const navigation = (
            <Navigation
                navTitle={this.props.navTitle}
                rightButtonTitle="Search"
                rightHandler={() => this.searchWrapper.open()}
                {...leftNavButtonProps} />
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
                    ref={(el) => { this.searchWrapper = el; }}
                    dataSet={this.props.contacts}
                    renderRow={this.renderRow}
                    searchRow={searchFor}>
                    <ListView
                        enableEmptySections
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
                            <Text style={styles.inviteButtonText}>
                                {`Invite to Txtling (min ${this.props.minInvitees})`}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps(state) {
    return {
        dataSource: dataSource.cloneWithRows(state.contacts.phoneContacts),
        allowAccessContacts: state.contacts.allowAccessContacts,
        phoneContactIds: state.contacts.phoneContactIds,
        contacts: state.contacts.phoneContacts
    };
}

export default connect(mapStateToProps, { getPhoneContacts, toggleRow, resetPhoneContacts })(InviteView);
