import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.white
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingLeft: 12,
        paddingRight: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey
    },
    rowInfoTitle: {
        fontWeight: 'bold'
    },
    rowInfoContent: {
        fontSize: 12,
        color: Colors.darkerGrey
    },
    initials: {
        width: 44,
        height: 44,
        borderWidth: 2,
        borderColor: Colors.darkGrey,
        borderRadius: 22,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    initialsBot: {
        borderColor: Colors.primary
    },
    initialsText: {
        color: Colors.darkerGrey,
        fontSize: 18
    },
    initialsBotText: {
        color: Colors.primary
    },
    rowInfo: {
        flex: 1
    },
    language: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    flagImage: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeText: {
        color: Colors.white
    }
});

export const activeColor = Colors.grey;

