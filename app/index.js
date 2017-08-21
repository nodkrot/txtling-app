import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import asyncTracker from './middlewares/asyncTracker.js';
import App from './App.js';
import reducer from './redux/index.js';

const logger = createLogger({ collapsed: true });
const promise = promiseMiddleware();

const middleware = process.env.NODE_ENV === 'production' ?
    [thunk, promise, asyncTracker] :
    [thunk, promise, asyncTracker];
    // [thunk, promise, asyncTracker, logger];

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
