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
        color: Colors.darkestGrey,
        paddingLeft: 8,
        paddingRight: 8
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
    actionLoader: {
        marginRight: 28
    },
    actionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 4,
        paddingRight: 4
    },
    sendButton: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.primary,
        paddingTop: 6,
        paddingBottom: 6
    },
    flagImage: {
        width: 32,
        height: 18,
        resizeMode: 'contain'
    },
    welcome: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 44
    },
    welcomeHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 12
    },
    welcomeText: {
        fontSize: 16
    }
});
