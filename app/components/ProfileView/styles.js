import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    container: {
        paddingLeft: 16
    },
    profile: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20
    },
    profileName: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 20,
        fontSize: 20
    },
    initials: {
        width: 64,
        height: 64,
        borderWidth: 2,
        borderColor: Colors.darkGrey,
        borderRadius: 44,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    initialsText: {
        fontSize: 24,
        color: Colors.darkerGrey
    }
});
