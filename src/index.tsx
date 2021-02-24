
import { Plugins } from '@capacitor/core';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import GrocApp from './App';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import orderStateReducer from './store/reducers/orderStateReducer';
import userPreferencesReducer from './store/reducers/userPreferencesReducer';
import { devToolsEnhancer } from 'redux-devtools-extension';

const { SplashScreen } = Plugins;
const rootReducer = combineReducers({
    orderState: orderStateReducer,
    userPrefs: userPreferencesReducer
});
const store = createStore(rootReducer, devToolsEnhancer({name: 'Srikanth'}));
ReactDOM.render(<Provider store={store}><GrocApp /></Provider>, document.getElementById('root'));
SplashScreen.hide();



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
