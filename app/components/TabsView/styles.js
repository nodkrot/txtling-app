import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    iphoneXTabBarSpace: {
        height: 83,
        paddingBottom: 24
    },
    titleStyle: {
        fontSize: 12,
        marginTop: 0,
        color: Colors.darkerGrey
    },
    selectedTitleStyle: {
        color: Colors.primary
    },
    badgeStyle: {
        borderRadius: 12,
        padding: 3,
        minWidth: 20,
        right: -12,
        backgroundColor: 'red'
    },
    badgeTextStyle: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 12
    }
});
