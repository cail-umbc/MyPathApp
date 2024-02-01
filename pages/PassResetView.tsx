import React, {useState, useEffect} from 'react';
import { 
    View,
    Alert,
    Text, 
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    SafeAreaView,
    LogBox,
    Linking,
    KeyboardAvoidingView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import CheckBox from '@react-native-community/checkbox';
import {useResetPassMutation} from '../services/userAuthApi';
import Toast from 'react-native-toast-message';





const SignInScreen = ({navigation}) => {

    const [email, setEmail] = useState("")
    const [resetPass] = useResetPassMutation()
    const sendPassResetLink = async() => {
      const resData = {email}
      const res = await resetPass(resData)
      if (res.data){
        Alert.alert("Password reset link sent, Please check your email.")
      }else{
        Alert.alert("Password reset failed!")
        console.log(res)
      }
    }

    return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >

      <View style={styles.container}>
          {/*
          previous color || change color
          <StatusBar backgroundColor='#308CD1' barStyle="light-content"/> */}
          <StatusBar backgroundColor='#308CD1' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Reset Password</Text>
        </View>
        
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
        <Toast/>
        <ScrollView nestedScrollEnabled={true}>
            <Text accessibilityLabel="Email address, this field is required" style={[styles.text_footer, {
                marginTop: 35
            }]}>Enter Your Email Address*</Text>
            <View accessibilityLabel="required" style={styles.action}>
                <FontAwesome 
                    name="envelope-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput
                    accessible={true}
                    accessibilityRole="none"
                    accessibilityLabel="This field is required"
                    placeholder="example@email.com"
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    autoCapitalize="none"
                    value = {email}
                    onChangeText={setEmail}
                    //onChangeText={(val) => handleEmailChange(val)}
                />
            </View>




            <View style={styles.button}>
                <TouchableOpacity accessibilityRole="button"
                    style={styles.signIn}
                    onPress={() => sendPassResetLink()}
                >
                    <LinearGradient
                        colors={['#127ACC', '#127ACC']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign, {
                            color:'#fff'
                        }]}>Send Password Reset Link</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            </ScrollView>


        </Animatable.View>
      </View>
    </KeyboardAvoidingView>

    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#308CD1'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });
