import styles from './styles';

import React, { Component, PropTypes } from 'react';
import {
    ScrollView,
    View,
    Text
} from 'react-native';

class ProfileView extends Component {

    render() {
        const { first_name, last_name } = this.props.profile;

        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profile}>
                    <View style={styles.initials}>
                        <Text style={styles.initialsText}>{`${first_name.charAt(0)}${last_name.charAt(0)}`}</Text>
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
