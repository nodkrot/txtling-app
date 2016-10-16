import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.white
    },
    imageGrid: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
});
