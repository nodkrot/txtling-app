import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.white
    },
    section: {
        backgroundColor: Colors.lightGrey
    },
    sectionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.darkerGrey,
        paddingLeft: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        paddingLeft: 12,
        paddingRight: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey
    },
    unregisteredRow: {
        marginLeft: 40
    },
    text: {
        flex: 1
    },
    initials: {
        width: 32,
        height: 32,
        borderWidth: 2,
        borderColor: Colors.darkGrey,
        borderRadius: 16,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    initialsText: {
        color: Colors.darkerGrey
    },
    rowLink: {
        color: Colors.primary
    },
    rowLinkIcon: {
        width: 32,
        height: 32,
        marginLeft: 6,
        marginTop: 6
    }
});

export const activeColor = Colors.grey;
export const primaryColor = Colors.primary;
