import { StyleSheet } from 'react-native';
import { Colors } from '../../../../styles';

const chatRow = {
    marginBottom: 6,
    flexDirection: 'column'
};

const bubble = {
    borderRadius: 9,
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 12,
    paddingRight: 12,
    width: 250
};

export default StyleSheet.create({
    chatRowLeft: {
        ...chatRow,
        marginLeft: 8,
        alignItems: 'flex-start'
    },
    chatRowRight: {
        ...chatRow,
        marginRight: 8,
        alignItems: 'flex-end'
    },
    bubbleWrapper: {
        flexDirection: 'row'
    },
    bubbleLeft: {
        ...bubble,
        backgroundColor: Colors.white
    },
    bubbleRight: {
        ...bubble,
        backgroundColor: '#5899DF'
    },
    bubbleText: {
        fontSize: 14
    },
    leftBubbleText: {
        color: Colors.black
    },
    rightBubbleText: {
        color: Colors.white
    },
    leftBubbleSubText: {
        color: '#747474'
    },
    rightBubbleSubText: {
        color: '#12589C'
    },
    animatedBubbleText: {
        overflow: 'hidden'
    },
    bubbleSubTextWrapper: {
        paddingTop: 8
    },
    chatInfo: {
        width: 250,
        marginTop: 2,
        paddingLeft: 6,
        paddingRight: 6,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    soundIcon: {
        marginTop: 2,
        marginLeft: 4,
        marginRight: 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    timestamp: {
        fontSize: 10,
        color: Colors.darkerGrey
    }
});

export const soundIconColor = Colors.darkerGrey;
export const bubbleRightPressColor = '#528ECF';
export const bubbleLeftPressColor = Colors.lightGrey;
