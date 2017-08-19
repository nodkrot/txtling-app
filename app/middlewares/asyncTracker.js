export function asyncStateTracker(options = {}) {
    return () => (next) => (action) => {
        const ASYNC_STATE_TRACKER = options.actionType || 'ASYNC_STATE_TRACKER';
        const actionPrefixes = options.actionPrefixes || ['REQUEST_', 'RECEIVE_', 'FAILURE_'];
        const prefixMatch = action.type.match(new RegExp(`^(${actionPrefixes.join('|')})`));

        if (prefixMatch) {
            const prefix = prefixMatch[0];
            const actionKey = action.type.substring(prefix.length);
            const actionValue = prefix === actionPrefixes[0];

            next({
                type: ASYNC_STATE_TRACKER,
                payload: { [actionKey]: actionValue }
            });
        }

        return next(action);
    };
}

export default asyncStateTracker();
