import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Navigator,
    View,
    Text,
    Image,
    ListView,
    TouchableHighlight,
    InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import Navigation from '../Navigation';
import { ROUTES } from '../../constants/AppConstants';
import { getLanguages } from '../../redux/languages';
import { registerLanguage } from '../../redux/user';
import SearchListView from '../SearchListView';
import Tracker from '../../utilities/tracker';
import styles, { activeColor } from './styles';

function searchFor(item, query) {
    const q = query.toLowerCase();

    return item.human_readable.toLowerCase().indexOf(q) >= 0;
}

class LanguagesView extends Component {
    static displayName = 'LanguagesView'

    static propTypes = {
        dataSource: PropTypes.object.isRequired,
        getLanguages: PropTypes.func.isRequired,
        languages: PropTypes.array.isRequired,
        navigator: PropTypes.object,
        registerLanguage: PropTypes.func.isRequired
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.getLanguages();
        });
    }

    handleRowPress = (rowData) => {
        this.searchWrapper.close();

        this.props.registerLanguage({
            language: rowData.google_code
        }).then(() => {
            this.props.navigator.push({
                id: ROUTES.inviteView,
                passProps: {
                    // navTitle: 'Invite minimum 3 friends',
                    // minInvitees: 3,
                    // onCancel: () => this.props.navigator.pop(),
                    onAfterInvite: () => {
                        this.props.navigator.push({
                            id: ROUTES.tabsView,
                            sceneConfig: {
                                ...Navigator.SceneConfigs.HorizontalSwipeJump,
                                gestures: null
                            },
                            passProps: { initialTab: 'contacts-view' }
                        });
                    }
                }
            });
        });

        Tracker.trackEvent('Languages', 'Select Language - Registration', { label: rowData.human_readable, value: 0 });
    }

    handleBackButton = () => {
        this.props.navigator.pop();
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
                    navTitle="Language to Learn"
                    leftButtonTitle="Back"
                    leftHandler={this.handleBackButton}
                    rightButtonTitle="Search"
                    rightHandler={() => this.searchWrapper.open()} />
                <SearchListView
                    ref={(el) => { this.searchWrapper = el; }}
                    dataSet={this.props.languages}
                    renderRow={this.renderRow}
                    searchRow={searchFor}>
                    <ListView
                        enableEmptySections
                        dataSource={this.props.dataSource}
                        renderRow={this.renderRow} />
                </SearchListView>
            </View>
        );
    }
}

const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps(state) {
    return {
        dataSource: dataSource.cloneWithRows(state.languages.allLanguages),
        languages: state.languages.allLanguages
    };
}

export default connect(mapStateToProps, {
    getLanguages, registerLanguage
})(LanguagesView);
