export function asyncStateTracker(options = {}) {
    return () => (next) => (action) => {
        const ASYNC_STATE_TRACKER = options.actionType || 'ASYNC_STATE_TRACKER';
        const actionSuffixes = options.actionSuffixes || ['_PENDING', '_FULFILLED', '_REJECTED'];
        const prefixMatch = action.type.match(new RegExp(`${actionSuffixes.join('|')}$`));

        if (prefixMatch) {
            const prefix = prefixMatch[0];
            const actionKey = action.type.slice(0, -prefix.length);
            const actionValue = prefix === actionSuffixes[0];

            next({
                type: ASYNC_STATE_TRACKER,
                payload: { [actionKey]: actionValue }
            });
        }

        return next(action);
    };
}

export default asyncStateTracker();
