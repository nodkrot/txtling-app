import { StyleSheet } from 'react-native';
import Color from 'color';
import { Colors } from '../../styles';

export default StyleSheet.create({
    linkButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkButtonText: {
        color: Colors.darkerGrey,
        fontSize: 18
    },
    linkButtonIcon: {
        marginLeft: 4,
        marginBottom: -4
    },

    button: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingTop: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledButton: {
        backgroundColor: Color(Colors.primary).alpha(0.5)
    },
    buttonText: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: 'bold'
    },
    buttonIcon: {
        marginLeft: 6,
        marginBottom: -2
    },

    rowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingLeft: 12,
        paddingRight: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey
    },
    rowButtonText: {
        fontSize: 14
    },
    rowButtonSubText: {
        fontSize: 12,
        color: Colors.darkerGrey,
        marginTop: 4
    },

    textInput: {
        height: 44,
        paddingLeft: 8,
        paddingRight: 8
    },
    textInputWrapper: {
        borderBottomColor: Colors.grey,
        borderBottomWidth: 2,
        marginBottom: 8
    },

    expandingTextField: {
        fontSize: 18
    }
});

export const darkerGrey = Colors.darkerGrey;
export const primaryColor = Colors.primary;
export const whiteColor = Colors.white;
export const greyColor = Colors.grey;
