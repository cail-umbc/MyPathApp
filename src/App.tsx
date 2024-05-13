// Entry point of the react-native app

import 'react-native-gesture-handler';

import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthContext} from '../components/context';
import HomeScreen from '../pages/HomeScreen';
import ExploreScreen from '../pages/ExploreScreen';
import ProfileScreen from '../pages/ProfileScreen';
import UpdateWcScreen from '../pages/UpdateWcScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerContent} from '../pages/DrawerContent';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RootStackScreen from '../pages/RootStackScreen';
import { MenuProvider } from 'react-native-popup-menu';
import {Provider} from "react-redux";
import {store} from "../App/store";

// Define all the navigation stacks using React Navigation
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Component to define the Bottom Tab Navigator
const BottomTabStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: '#308CD1', // change color
        },
      }}>

    {/* Define individual screens within the Tab
     Navigator with custom icons and styles */}
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: { fontSize: 15 },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Data Summary',
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="history"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


// Stack navigator for the Home screen
const HomeScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabStack" component={BottomTabStack} />
    </Stack.Navigator>
  );
};

// Stack navigator for the Profile screen, including additional screens within this stack
const ProfileScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SecondPage"
      screenOptions={{headerShown: false}}>
        
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="UpdateWcScreen" component={UpdateWcScreen} />
    </Stack.Navigator>
  );
};


// The Main React Native App component
function App(){

  // Initial state for the login process
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  // Reducer for managing login state changes
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };


  // State and dispatcher for login management
  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  // Context for managing authentication and theme toggling // theme toggling is not being in used
  const authContext = React.useMemo(
    () => ({
      signIn: async foundUser => {
        const userToken = String(foundUser[0].userToken);
        const userName = foundUser[0].username;

        try {
          await AsyncStorage.setItem('userToken', userToken);
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGIN', id: userName, token: userToken});
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
      signUp: () => {
      },
      toggleTheme: () => {
        setIsDarkTheme(isDarkTheme => !isDarkTheme);
      },
    }),
    [],
  );

  // Effect to retrieve the token at initial load
  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    }, 1000);
  }, []);

  // Show loading indicator while the app is fetching user token
  if (loginState.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null ? (
        <Drawer.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#308CD1', //Set Header color // change color
            },
            headerTintColor: '#fff', //Set Header text color
          }}
          drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen
            name="HomeScreenStack"
            options={{
              drawerLabel: 'Home Screen Option',
              title: 'My Path',
            }}
            component={HomeScreenStack}
          />
          <Drawer.Screen
            name="ProfileScreenStack"
            options={{
              drawerLabel: 'Profile Screen Option',
              title: 'Profile',
            }}
            component={ProfileScreenStack}
          />
        </Drawer.Navigator>
        ):(
        <RootStackScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default () =>{
  return (
    <Provider store={store}>
      <MenuProvider>
        <App />
      </MenuProvider>
    </Provider>
  )
};