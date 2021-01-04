
import { Plugins } from '@capacitor/core';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { useIonRouter } from '@ionic/react';
import GrocApp from './App';
const { MobileApp } = Plugins

const { SplashScreen } = Plugins;
ReactDOM.render(<GrocApp />, document.getElementById('root'));
SplashScreen.hide();



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
