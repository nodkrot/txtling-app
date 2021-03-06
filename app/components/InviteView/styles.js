import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.white
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingLeft: 12,
        paddingRight: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey
    },
    subText: {
        fontSize: 12,
        color: Colors.darkerGrey,
        marginTop: 4
    },
    rowCheckIcon: {
        width: 24,
        height: 24,
        marginRight: 8
    },
    inviteButton: {
        height: 44,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    iphoneXSpace: {
        height: 83,
        paddingBottom: 24
    },
    inviteButtonText: {
        fontWeight: 'bold',
        color: Colors.primary
    },
    buttonCounter: {
        height: 24,
        width: 24,
        borderRadius: 12,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary
    },
    buttonCounterText: {
        color: Colors.white,
        backgroundColor: 'transparent'
    },
    contactsDenied: {
        textAlign: 'center',
        padding: 40,
        fontSize: 18
    },
    contactsDeniedButton: {
        marginRight: 12,
        marginLeft: 12
    }
});

export const greyColor = Colors.grey;
export const darkGreyColor = Colors.darkGrey;
export const greenColor = Colors.success;
