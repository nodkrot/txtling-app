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
    closeIcon: {
        paddingLeft: 16,
        paddingRight: 16
    }
});
