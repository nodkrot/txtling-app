import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import asyncTracker from './middlewares/asyncTracker.js';
import App from './App.js';
import reducer from './reducers';

const logger = createLogger({ collapsed: true });

const middleware = process.env.NODE_ENV === 'production' ?
    [thunk, asyncTracker] :
    // [thunk, asyncTracker];
    [thunk, asyncTracker, logger];

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class TxtlingApp extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}
