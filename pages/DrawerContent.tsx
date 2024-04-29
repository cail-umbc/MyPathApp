import React, {useState, useEffect, useRef} from 'react';
import { View, StyleSheet } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import{ AuthContext } from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createTempSessionInfo, createSessionInfo, addSessionInfo, getSessionInfo, addWheelchairInfo, loadUserWheelchairInfo, removeToken, getToken, checkFirstTimeLoggedIn, checkUserFirstTimeFlag, setFirstTimeLoggedIn, setID, setName, getName} from '../services/AsyncStorageService';
import {useGetLoggedUserQuery} from '../services/userAuthApi';
import GlobalArraySingleton from './SingletonAcc/GlobalArraySingleton';
import GlobalWheelchairSingleton from './SingletonAcc/GlobalWheelchairSingleton';

export function DrawerContent(props) {
    const name = useRef('')
    const accs = useRef('');
    const [token, setToken] = useState({})

    useEffect(() => {
        (async () => {
            const asyToken = await getToken()

            if (asyToken){
                const {refresh, access} = JSON.parse(asyToken)
                accs.current = access
                setToken({
                    "access": access,
                    "refresh": refresh
                })
            }

            const isFirstTimeAvailable = await checkUserFirstTimeFlag()
            if (!isFirstTimeAvailable)
            {
                SignOutAndRemoveToken()

            }

            const isFirstTimeLoggedIn = await checkFirstTimeLoggedIn()
            if (isFirstTimeLoggedIn)
            {
                getUserData()
                getUserSessions()
                getUserWheelchairInfo()
                setFirstTimeLoggedIn("0")
            }else{
                name.current = await getName()
                const sessions = await getSessionInfo()
                //getUserWheelchairInfo()
                await loadWheelchairInfo_To_GlobalArray()
                GlobalArraySingleton.setArray(sessions)
            }
        })();
    }, [])

    const loadWheelchairInfo_To_GlobalArray = async () =>{
        const wcData = await loadUserWheelchairInfo()
        GlobalWheelchairSingleton.setArray(wcData)

    }

    const getUserData = async() => {
        
        fetch('https://mypathweb.csi.miamioh.edu/api/user/idinfo/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accs.current
        }
        })
        .then(response => response.json())
        .then(data => assignData(data))
        .catch(error => console.error(error));
    }

    const assignData = async(data) => {
        name.current = data.name
        await setID(data.id + "")
        await setName(data.name)
        await createSessionInfo([])
        await createTempSessionInfo([])
        //await createWheelchairInfo([])
    }

    const getUserSessions = async() => {
        //console.log("Fetch testing " + accs.current)
        // fetch('https://MyPathWeb.csi.miamioh.edu/api/user/sessions/', {
        // method: 'GET',
        // headers: {
        //     'Authorization': 'Bearer ' + accs.current
        // }
        // })
        // .then(response => response.json())
        // .then(data => assignSessionsData(data))
        // .catch(error => console.error(error));
        assignSessionsData([])
    }

    const assignSessionsData = async(data) => {
        
        const tempSesArr = []
        const tempGlobalStArr = []
        for (let i=0; i<data.length; i++)
        {
            tempSesArr.push({st: parseInt(data[i]['st']), et: data[i]['et'], sbt: data[i]['sbt']})
        }
        tempSesArr.sort((a,b) => a.st - b.st)
        for (let i=0; i<tempSesArr.length; i++)
        {
            tempGlobalStArr.push({lid: i, st:tempSesArr[i]['st'].toString(), et:tempSesArr[i]['et'], sbt:tempSesArr[i]['sbt']})
            await addSessionInfo(tempSesArr[i]['st'], tempSesArr[i]['et'], tempSesArr[i]['sbt']) 
            //console.log(i)
        }
        GlobalArraySingleton.setArray(tempGlobalStArr)
        name.current = await getName()
    }

    const getUserWheelchairInfo = async() => {
        console.log("User wheelchair get")
        fetch('https://mypathweb.csi.miamioh.edu/api/user/wcdata/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accs.current
        }
        })
        .then(response => response.json())
        .then(data => assignWheelchairData(data))
        .catch(error => console.error(error));   
    }

    const assignWheelchairData = async(data) =>{
        await addWheelchairInfo(data, true)
        await loadWheelchairInfo_To_GlobalArray()
    }

    const paperTheme = useTheme();
    const { signOut, toggleTheme } = React.useContext(AuthContext);
    const {data, error, isError, isSuccess, isLoading} = useGetLoggedUserQuery(token.access)
    //const {dataSes, errorSes, isErrorSes, isSuccessSes, isLoadingSes} = useGetUserSessionsQuery(token.access)

    const SignOutAndRemoveToken = async () =>
    {
        await createSessionInfo([])
        await addWheelchairInfo([], true)
        await removeToken()
        console.log("Signout")
        signOut()
    }

    
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}} >
                            <Avatar.Image 
                                source={{
                                    uri: 'https://gravatar.com/avatar/0db13c2d691eea07102e90ef64a26511?s=200&d=identicon&r=x'
                                }}
                                size={40}
                            />
                            <View
                                accessible={true}
                                accessibilityRole="none"
                                accessibilityLabel="Click on this to go to home screen"
                                style={{marginLeft:15, flexDirection:'column'}}>
                                <Title onPress={() => {props.navigation.navigate('HomeScreenStack')}} style={styles.title}>{name.current}</Title>
                            </View>
                        </View>

                        <View style={styles.row}>
                            {/* <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                <Caption style={styles.caption}>Followers</Caption>
                            </View> */}
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('ProfileScreenStack')}}
                        />

                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => {props.navigation.navigate('HomeScreenStack')}}
                        />
                        {/* <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Ionicons 
                                name="settings-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('SettingsScreen')}}
                        /> */}



                    {/* <Text style={[styles.text_footer, {
                                    marginTop: 35
                                }]}></Text>

                    <Text style={[styles.text_footer, {
                                    marginTop: 35
                                }]}></Text> */}


                    </Drawer.Section>
                    {/* <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                </View>
            </DrawerContentScrollView>
            
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {SignOutAndRemoveToken()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 17,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 16,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 5,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
