import React from 'react';
import { View, Text, Button, TouchableOpacity, Dimensions, StyleSheet, StatusBar, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
    const { colors } = useTheme();

    const TestData = async () =>{
        try {
            await AsyncStorage.setItem('userToken', "data");
            console.log("Done")
        }catch (e) {
            //alert('Failed to sync user name');
            console.log("catch status: ");
        }
    }

    return (
      <View style={styles.container}>
        {/* change color */}
          <StatusBar backgroundColor='#308CD1' barStyle="light-content"/>
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={require('../assets/logo2.png')}
            style={styles.logo}
            resizeMode="stretch"
            />
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
            animation="fadeInUpBig"
        >
            <Text style={[styles.title, {
                color: colors.text
            }]}>MyPath</Text>
            <Text style={styles.text}>We Generate Accessible Routes Together</Text>
            <View role="button" style={styles.buttonView}>
                {/* <Button
                    color="#127ACC"
                    title="Get Started"
                    role="button"
                    // accessibilityLabel="Learn more about this purple button"
                    onPress={()=> navigation.navigate('SignInScreen')}
                    /> */}
            <TouchableOpacity
            accessibilityRole="none"
            accessibilityRole="button"
            onPress={()=>
                navigation.navigate('SignInScreen')}>
                <LinearGradient
                    colors={['#308CD1', '#308CD1']}
                    style={styles.signIn}>
                    <Text style={styles.textSign}>Get Started </Text>
                    {/* <MaterialIcons 
                        name="navigate-next"
                        color="#fff"
                        size={20}
                    /> */}
                </LinearGradient>
            </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
    );
};
//com.routemypath.MyPathApp
export default SplashScreen;



const {height} = Dimensions.get("screen");
const height_logo = height * 0.40;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#308CD1'
    // backgroundColor: '#009387' // change color
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 32,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5,
      fontSize: 18
  },
  buttonView: {
      alignItems: 'flex-end',
      marginTop: 30,
      color: '#127ACC'
  },
  button: {
    color: '#3D4144'
    //   color: '#127ACC'
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});

