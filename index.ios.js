/**
 * Txtling App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './app';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './app/reducers';

const logger = createLogger({ collapsed: true });

const middleware = process.env.NODE_ENV === 'production' ?
    [thunk] :
    // [thunk];
    [thunk, logger];

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

AppRegistry.registerComponent('TxtlingApp', () => TxtlingApp);
