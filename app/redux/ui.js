const initialState = {
    asyncStates: {}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'ASYNC_STATE_TRACKER':
            return { ...state, asyncStates: { ...action.payload } }
        default:
            return state;
    }
}
