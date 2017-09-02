import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ScrollView,
    View,
    Text
} from 'react-native';
import { getInitials } from '../../utilities';
import styles from './styles';

class ProfileView extends Component {
    render() {
        const { first_name, last_name } = this.props.profile;

        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profile}>
                    <View style={styles.initials}>
                        <Text style={styles.initialsText}>{getInitials(first_name, last_name)}</Text>
                    </View>
                    <Text style={styles.profileName}>{`${first_name} ${last_name}`}</Text>
                </View>
                {this.props.children}
            </ScrollView>
        );
    }
}

ProfileView.propTypes = {
    children: PropTypes.any,
    navigator: PropTypes.object,
    profile: PropTypes.object.isRequired
};

export default ProfileView;
