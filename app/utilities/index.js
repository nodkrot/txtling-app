import { Dimensions, Platform } from 'react-native';

export function getScrollOffset(event) {
    const {
        contentSize,
        contentInset,
        contentOffset,
        layoutMeasurement
    } = event.nativeEvent;

    const contentLength = contentSize.height;
    const trailingInset = contentInset.bottom;
    const scrollOffset = contentOffset.y;
    const viewportLength = layoutMeasurement.height;

    return contentLength + trailingInset - scrollOffset - viewportLength;
}

export function formatPhone(number) {
    return number.replace(/\(|\)| |-|\D/g, '').split('').reduce((acc, el) => {
        if (acc.length === 1) {
            return '(' + acc + el;
        } else if (acc.length === 4) {
            return acc + ') ' + el;
        } else if (acc.length === 9) {
            return acc + '-' + el;
        } else if (acc.length > 13) {
            return acc;
        }

        return acc + el;
    }, '');
}

export function getInitials(firstName, lastName) {
    let initials = '';

    if (firstName && firstName.length) {
        initials += firstName.charAt(0);
    }

    if (lastName && lastName.length) {
        initials += lastName.charAt(0);
    }

    return initials;
}

export function isIphoneX() {
    const { height, width } = Dimensions.get('window');

    return Platform.OS === 'ios' && (height === 812 || width === 812);
}
