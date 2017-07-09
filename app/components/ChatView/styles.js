import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.grey
    },
    chatThreadHeader: {
        height: 10
    },
    infoRow: {
        paddingTop: 4,
        paddingBottom: 12
    },
    infoRowText: {
        textAlign: 'center',
        color: Colors.darkestGrey
    },
    footerBar: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12
    },
    chatTextInput: {
        flex: 1,
        paddingTop: 2,
        paddingBottom: 2
    },
    sendButton: {
        width: 56,
        fontSize: 18,
        textAlign: 'center',
        color: Colors.primary,
        paddingTop: 8,
        paddingBottom: 8
    }
});
