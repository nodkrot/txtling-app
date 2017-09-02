import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView, InteractionManager, TouchableHighlight, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import Navigation from '../Navigation';
import { getLanguages } from '../../redux/languages';
import { updateSettings } from '../../redux/chat';
import Tracker from '../../utilities/tracker';
import styles, { activeColor } from './styles';

class ChatSettingsView extends Component {
    static displayName = 'ChatSettingsView'

    static propTypes = {
        groupId: PropTypes.string,
        user: PropTypes.object,
        navigator: PropTypes.object,
        languages: PropTypes.array,
        dataSource: PropTypes.object,
        getLanguages: PropTypes.func,
        updateSettings: PropTypes.func,
        onComplete: PropTypes.func
    }

    componentWillMount() {
        if (!this.props.languages.length) {
            InteractionManager.runAfterInteractions(() => {
                this.props.getLanguages();
            });
        }
    }

    handleBackButton = () => {
        this.props.navigator.pop();
    }

    handleRowPress = (lang) => {
        this.props.updateSettings({
            id: this.props.groupId,
            learn_lang: lang.human_readable,
            learn_lang_code: lang.google_code
        }).then(() => {
            this.props.navigator.pop();
            this.props.onComplete(lang);
        });

        Tracker.trackEvent('Languages', 'Select Language - Settings', { label: lang.human_readable, value: 0 });
    }

    renderRow = (rowData) => (
        <TouchableHighlight onPress={() => this.handleRowPress(rowData)} underlayColor={activeColor}>
            <View>
                <View style={styles.row}>
                    <Image
                        source={{ uri: rowData.image_url }}
                        style={styles.image} />
                    <Text style={styles.text}>
                        {rowData.human_readable}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>
    )

    render() {
        return (
            <View style={styles.main}>
                <Navigation
                    navTitle="Change Language"
                    leftButtonTitle="Back"
                    leftHandler={this.handleBackButton} />
                <ListView
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
        dataSource: dataSource.cloneWithRows(state.languages.allLanguages),
        languages: state.languages.allLanguages
    };
}

export default connect(mapStateToProps, { getLanguages, updateSettings })(ChatSettingsView);
