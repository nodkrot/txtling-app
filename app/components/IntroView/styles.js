import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../styles';

const slideWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.white
    },
    slide: {
        flex: 1,
        alignItems: 'center'
    },
    slideImage: {
        width: slideWidth,
        height: 360
    },
    logoText: {
        fontSize: 50,
        color: Colors.primary,
        marginTop: -16,
        marginBottom: 30
    },
    titleText: {
        fontSize: 28,
        color: Colors.primary,
        marginTop: 20,
        marginBottom: 20
    },
    text: {
        color: Colors.darkestGrey,
        fontSize: 16,
        textAlign: 'center'
    },
    nextButton: {
        position: 'absolute',
        bottom: 54,
        left: 0,
        right: 0
    },
    buttonWrap: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        paddingLeft: 24,
        paddingRight: 24
    },
    pagination: {
        bottom: 120
    },
    dot: {
        borderWidth: 1,
        borderColor: Colors.primary,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    activeDot: {
        backgroundColor: Colors.primary
    }
});
