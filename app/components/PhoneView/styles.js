import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.white
    },
    container: {
        paddingTop: 20,
        paddingLeft: 16,
        paddingRight: 16
    },
    formGroup: {
        overflow: 'hidden',
        flexDirection: 'row'
    },
    preTextField: {
        width: 44,
        marginBottom: 8
    },
    textField: {
        flex: 1,
        marginBottom: 8
    }
});
