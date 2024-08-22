/* eslint-disable prettier/prettier */
/**
 * @format
 */

import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './App';
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';

export default function Main() {
  return (
    <TailwindProvider utilities={utilities}>
     <PaperProvider>
      <App />
    </PaperProvider>
   </TailwindProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
