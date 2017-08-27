import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        paddingTop: 20,
        paddingLeft: 16,
        paddingRight: 16
    },
    info: {
        flexDirection: 'row'
    },
    picture: {
        flex: 1
    },
    name: {
        flex: 2
    },
    textField: {
        marginBottom: 8
    },
    cameraButton: {
        marginTop: 6,
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 2,
        borderColor: '#efefef',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    cameraButtonText: {
        width: 44,
        color: '#aaa',
        textAlign: 'center'
    }
});
