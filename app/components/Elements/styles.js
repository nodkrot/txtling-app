import { StyleSheet } from 'react-native';
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
    buttonText: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: 'bold'
    },
    buttonIcon: {
        marginLeft: 6,
        marginBottom: -2
    }
});

export const buttonIconColor = Colors.white;
export const linkButtonIconColor = Colors.darkerGrey;
