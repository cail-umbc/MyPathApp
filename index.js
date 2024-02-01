/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);


// import * as React from 'react'
// import { createRoot } from "react-dom/client";

// import { Provider } from 'react-redux'

// import App from './src/App'
// import { store } from './App/store'
// const rootElement = document.getElementById("root");
// const root = createRoot(rootElement);


// root.render(
//   <StrictMode>
//     <Provider store={store}>
//         <App />
//     </Provider>
//   </StrictMode>
// );

