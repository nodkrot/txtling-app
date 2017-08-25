import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
import asyncTracker from './middlewares/asyncTracker';
import App from './App';
import reducer from './redux';

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
    GoogleAnalyticsSettings.setDryRun(true);
}

const logger = createLogger({ collapsed: true });
const promise = promiseMiddleware();

const middleware = isProduction ?
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
