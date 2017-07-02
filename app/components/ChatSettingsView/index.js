import styles, { activeColor } from './styles';

import React, { Component, PropTypes } from 'react';
import { View, ListView, InteractionManager, TouchableHighlight, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import Navigation from '../Navigation';
import { getLanguages } from '../../redux/languages';
import { updateSettings } from '../../redux/chat';

class ChatSettingsView extends Component {

    constructor(props) {
        super(props);

        this.handleBackButton = this.handleBackButton.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    componentWillMount() {
        if (!this.props.languages.length) {
            InteractionManager.runAfterInteractions(() => {
                this.props.getLanguages();
            });
        }
    }

    handleBackButton() {
        this.props.navigator.pop();
    }

    handleRowPress(lang) {
        // this.props.updateSettings
        console.log({
            id: this.props.groupId,
            learn_lang: lang.human_readable,
            learn_lang_code: lang.google_code
        });
    }

    renderRow(rowData) {
        return (
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
        );
    }

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

ChatSettingsView.propTypes = {
    groupId: PropTypes.string,
    user: PropTypes.object,
    navigator: PropTypes.object,
    languages: PropTypes.array,
    dataSource: PropTypes.object,
    getLanguages: PropTypes.func,
    updateSettings: PropTypes.func
};

const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps(state) {
    return {
        user: state.Login,
        dataSource: dataSource.cloneWithRows(state.languages.allLanguages),
        languages: state.languages.allLanguages
    };
}

export default connect(mapStateToProps, { getLanguages, updateSettings })(ChatSettingsView);
