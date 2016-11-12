import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    linkButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    linkButtonText: {
        color: Colors.darkerGrey,
        fontSize: 18
    },
    linkButtonIcon: {
        marginLeft: 4
    }
});

export const iconColor = Colors.darkerGrey;
