import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

const AppUrlListener = () => {
    let history = useHistory();
    useEffect(() => {
      App.addListener('appUrlOpen', (data) => {
        // Example url: https://beerswift.app/tabs/tab2
        // slug = /tabs/tab2
        const slug = data.url.split('.app').pop();
        if (slug) {
          history.push(slug);
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    }, []);
  
    return null;
  };

export default AppUrlListener;