import React, { Component, PropTypes } from 'react';
import {
    View,
    Modal,
    ListView,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { debounce } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextField } from '../Elements';
import styles from './styles';

const resultsCache = {
    dataForQuery: {},
    totalForQuery: {}
};

export default class SearchListView extends Component {
    static displayName = 'SearchListView'

    static propTypes = {
        children: PropTypes.shape({ type: PropTypes.oneOf([ListView]) }).isRequired,
        dataSet: PropTypes.array.isRequired,
        renderRow: PropTypes.func.isRequired,
        searchRow: PropTypes.func.isRequired
    }

    state = {
        isModalVisible: false,
        searchDataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
    }

    componentWillMount() {
        this.search = debounce(this.search, 100);
    }

    componentDidMount() {
        this.search('');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSet !== this.props.dataSet) {
            this.setDataSource(nextProps.dataSet);
        }
    }

    open = () => {
        if (!this.isOpen()) {
            this.search('');
            this.setState({ isModalVisible: true });
            StatusBar.setBarStyle('default', true);
        }
    }

    close = () => {
        if (this.isOpen()) {
            this.setState({ isModalVisible: false });
            StatusBar.setBarStyle('light-content');
        }
    }

    isOpen = () => this.state.isModalVisible

    search = (q) => {
        if (!q) {
            this.setDataSource(this.props.dataSet);
        } else {
            let results = resultsCache.dataForQuery[q];

            if (!results) {
                results = this.props.dataSet.filter((c) => this.props.searchRow(c, q));
                resultsCache.dataForQuery[q] = results;
                resultsCache.totalForQuery[q] = results.length;
            }

            this.setDataSource(results);
        }
    }

    setDataSource = (data) => {
        this.setState({ searchDataSource: this.state.searchDataSource.cloneWithRows(data) });
    }

    renderHeader = () => (
        <View style={styles.searchWrapper}>
            <TextField
                autoFocus
                wrapperStyle={styles.searchField}
                placeholder="Search"
                onChangeText={this.search} />
            <TouchableOpacity onPress={this.close}>
                <Icon name="ios-close" size={44} style={styles.closeIcon} />
            </TouchableOpacity>
        </View>
    )

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
                            keyboardShouldPersistTaps={true}
                            dataSource={this.state.searchDataSource}
                            renderRow={this.props.renderRow} />
                    </View>
                </Modal>
                {this.props.children}
            </View>
        );
    }
}
