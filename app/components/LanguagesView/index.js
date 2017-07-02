import styles, { activeColor } from './styles';

import React, { Component, PropTypes } from 'react';
import {
    Navigator,
    View,
    Text,
    Image,
    ListView,
    TouchableHighlight,
    InteractionManager
} from 'react-native';
import Navigation from '../Navigation';
import { connect } from 'react-redux';
import { ROUTES } from '../../constants/AppConstants';
import { getLanguages } from '../../redux/languages';
import { registerLanguage } from '../../actions/LoginActions';
import SearchListView from '../SearchListView';

function searchFor(item, query) {
    const q = query.toLowerCase();

    return item.human_readable.toLowerCase().indexOf(q) >= 0;
}

class LanguagesView extends Component {

    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.getLanguages();
        });
    }

    handleRowPress(rowData) {
        this.refs.searchWrapper.close();

        this.props.registerLanguage({
            language: rowData.google_code
        }).then(() => {
            this.props.navigator.push({
                id: ROUTES.inviteView,
                passProps: {
                    navTitle: 'Invite minimum 3 friends',
                    minInvitees: 3,
                    onAfterInvite: () => {
                        this.props.navigator.push({
                            id: ROUTES.tabsView,
                            sceneConfig: {
                                ...Navigator.SceneConfigs.HorizontalSwipeJump,
                                gestures: null
                            }
                        });
                    }
                }
            });
        });
    }

    handleBackButton() {
        this.props.navigator.pop();
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
                    navTitle="Language to Learn"
                    leftButtonTitle="Back"
                    leftHandler={this.handleBackButton}
                    rightButtonTitle="Search"
                    rightHandler={() => this.refs.searchWrapper.open()} />
                <SearchListView
                    ref="searchWrapper"
                    dataSet={this.props.languages}
                    renderRow={this.renderRow}
                    searchRow={searchFor}>
                    <ListView
                        dataSource={this.props.dataSource}
                        renderRow={this.renderRow} />
                </SearchListView>
            </View>
        );
    }
}

LanguagesView.propTypes = {
    dataSource: PropTypes.object.isRequired,
    getLanguages: PropTypes.func.isRequired,
    languages: PropTypes.array.isRequired,
    navigator: PropTypes.object,
    registerLanguage: PropTypes.func.isRequired
};

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
