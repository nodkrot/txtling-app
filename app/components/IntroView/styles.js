import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.white
    },
    page: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
    pageIndicator: {
        position: 'absolute',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    pageIndicatorTop: {
        top: 250,
        alignSelf: 'center'
    },
    pageIndicatorBottom: {
        bottom: 250,
        alignSelf: 'center'
    },
    slide: {
        flex: 1,
        backgroundColor: 'lightgray',
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#92BBD9',
        fontSize: 30,
        fontWeight: 'bold'
    }
});
