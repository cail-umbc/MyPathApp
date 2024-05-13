// this page is for the initial screens before login the app

import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import PassResetView from './PassResetView';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (

    // stack navigator with all the required screens
    <RootStack.Navigator 
    screenOptions={{ headerShown: false, }}
    screenOptions={{ headerMode: 'none' }}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <RootStack.Screen name="PassResetView" component={PassResetView}/>
    </RootStack.Navigator>
);

export default RootStackScreen;