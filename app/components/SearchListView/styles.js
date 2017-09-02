import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.white
    },
    modal: {
        flex: 1,
        backgroundColor: Colors.white
    },
    topSpacer: {
        height: 20
    },
    searchWrapper: {
        flexDirection: 'row'
    },
    searchField: {
        flex: 1
    },
    closeButton: {
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 0,
        top: 0
    },
    closeButtonIcon: {
        paddingLeft: 16,
        paddingRight: 16
    }
});
