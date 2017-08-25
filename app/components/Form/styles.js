import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    textfield: {
        height: 44,
        fontSize: 18
    },
    textInputWrapper: {
        borderBottomColor: Colors.grey,
        borderBottomWidth: 2,
        marginBottom: 8
    },
    textInput: {
        height: 44,
        paddingLeft: 8,
        paddingRight: 8
    },
    fab: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    button: {
        height: 44,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.primary
    },
    coloredButtonText: {
        color: Colors.white,
        fontWeight: 'bold'
    },
    flatButtonText: {
        fontWeight: 'bold',
        color: Colors.primary
    },
    icon: {
        width: 24,
        height: 44
    },
    autoExpandingTextField: {
        fontSize: 18
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
    }
});

export const primaryColor = Colors.primary;
export const whiteColor = Colors.white;
export const greyColor = Colors.grey;
