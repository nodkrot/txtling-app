import styles from './styles';

import React, { PropTypes } from 'react';
import {
    View,
    Modal,
    ListView
} from 'react-native';
import { debounce } from 'lodash';
import SearchBar from 'react-native-search-bar';

const resultsCache = {
    dataForQuery: {},
    totalForQuery: {}
};

export default React.createClass({

    propTypes: {
        children: PropTypes.shape({ type: PropTypes.oneOf([ListView]) }).isRequired,
        dataSet: PropTypes.array.isRequired,
        renderRow: PropTypes.func.isRequired,
        searchRow: PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            isModalVisible: false,
            searchDataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };
    },

    componentWillMount() {
        this.search = debounce(this.search, 150);
    },

    componentDidMount() {
        this.search('');
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSet !== this.props.dataSet) {
            this.setState({
                searchDataSource: this.getDataSource(nextProps.dataSet)
            });
        }
    },

    open() {
        if (!this.isOpen()) {
            this.search('');
            this.setState({ isModalVisible: true });
            // this.refs.searchModal.refs.searchBar.focus();
        }
    },

    close() {
        if (this.isOpen()) {
            this.setState({ isModalVisible: false });
        }
    },

    isOpen() {
        return this.state.isModalVisible;
    },

    search(q) {
        if (!q) {
            this.setState({ searchDataSource: this.getDataSource(this.props.dataSet) });
            return;
        }

        let results = resultsCache.dataForQuery[q];

        if (!results) {
            results = this.props.dataSet.filter((c) => this.props.searchRow(c, q));
            resultsCache.dataForQuery[q] = results;
            resultsCache.totalForQuery[q] = results.length;
        }

        this.setState({ searchDataSource: this.getDataSource(results) });
    },

    getDataSource(data) {
        return this.state.searchDataSource.cloneWithRows(data);
    },

    renderHeader() {
        return (
            <SearchBar
                ref="searchBar"
                placeholder="Search"
                showsCancelButton
                onCancelButtonPress={this.close}
                onChangeText={this.search} />
        );
    },

    render() {
        return (
            <View style={styles.main}>
                <Modal
                    ref="searchModal"
                    animationType="slide"
                    visible={this.state.isModalVisible}>
                    <View style={styles.modal}>
                        <View style={styles.topSpacer} />
                        {this.renderHeader()}
                        <ListView
                            dataSource={this.state.searchDataSource}
                            renderRow={this.props.renderRow} />
                    </View>
                </Modal>
                {this.props.children}
            </View>
        );
    }
});
