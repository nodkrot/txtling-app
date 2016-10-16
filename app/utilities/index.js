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
        } else {
            return acc + el;
        }
    }, '');
}
