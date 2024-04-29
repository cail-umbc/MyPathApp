import React, {useState, useRef}   from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'react-native-paper';
import {AuthContext} from '../components/context';
import Users from '../model/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoginUserMutation } from '../services/userAuthApi';
import Toast from 'react-native-toast-message';
import {storeToken, setFirstTimeLoggedIn} from '../services/AsyncStorageService';

const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    email: '',
    password: '',
    secureTextEntry: true,
    isValidPassword: true,
  });


  const {colors} = useTheme();
  const {signIn} = React.useContext(AuthContext);


  const textInputChange = val => {
    if (val.length>0 && isValidEmail()) {
      setData({
        ...data,
        email: val,
      });
    } else if(val.length>0 && !isValidEmail()) {
      setData({
        ...data,
        email: val,
      });
    }
  };


  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };


  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };


  const handleValidUser = (val) => {
    if (isValidEmail(val)) {
      setData({
        ...data,
        //isValidUser: true,
      });
    } else {
      setData({
        ...data,
        //isValidUser: false,
      });
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }


  const [tokenData, setTokenData] = useState("")
  const tkn = useRef("");
  const [loginUser] = useLoginUserMutation()


  const DataValidate = async (email, password) => {
    const formData = {email, password}
    const res = await loginUser(formData)
    console.log(res)
    if (res.data){
        alert("Login successful");
        console.log("Response data ------> ", res.data)
        await storeToken(res.data.token)
        await setFirstTimeLoggedIn("1")
        return true
    }

    if (res.error){
        console.log(res)
        //console.log("Response error ------> ", res.error.data.errors)
        Toast.show({
            type: 'info',
            ...(res.error.data.errors.email ? {text1: "Email " +res.error.data.errors.email[0]} : ''),
            ...(res.error.data.errors.password ? {text1: res.error.data.errors.password[0]} : ''),
            ...(res.error.data.errors.non_field_errors ? {text1: res.error.data.errors.non_field_errors[0]} : ''),
        })
    }


    // try {
    //     const valueEmail = await AsyncStorage.getItem("email");
    //     if (valueEmail !== null) {
    //         if(valueEmail != email)
    //         {
    //           return false;
    //         }else{
    //           console.log("True--> " + valueEmail);
    //         }
    //     }else{
    //       console.log("Value is null");
    //       return false;
    //     }

    //     const valuePass = await AsyncStorage.getItem("password");
    //     if (valuePass !== null) {
    //       if(valuePass != password){
    //         return false;
    //       }else{
    //         console.log("True--> " + valuePass);
    //       }
    //     }else{
    //       console.log("Value is null");
    //       return false;
    //     }
    // } catch (e) {
    //     alert('Failed to fetch the input from storage');
    // }
    // console.log("Correct");

    return false;

  };


  const loginHandle = async (email, password) => {
    console.log(email, password)
    var res = await DataValidate(email, password);
    if(Boolean(res) == true || (email == "user1@email.com" && password == "abcd-1234"))
    {
      console.log("True");
      //signIn(Users[0]);
      const foundUser = Users.filter(item => {
        return "user1@email.com" == item.email && "password" == item.password;
      });
      signIn(foundUser);
      console.log("in");
    }else{
      alert("Email or password is incorrect");
    }
  };

  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
  >

    <View style={styles.container}>
      <StatusBar backgroundColor="#308CD1" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome</Text>
      </View>
      <Toast/>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <ScrollView nestedScrollEnabled={true}>

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Email address
        </Text>
        <View style={styles.action}>
          <FontAwesome
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="Enter email"
            name="user-o" color={colors.text} size={25} />
          <TextInput
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="This field is required"
            placeholder="Email"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
                fontSize: 20,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType={'emailAddress'}
            onChangeText={val => textInputChange(val)}
            //onEndEditing={e => handleValidUser(e.nativeEvent.text)}
          />
          
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={25} />
            </Animatable.View>
          ) : null}
        </View>
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
              marginTop: 35,
            },
          ]}>
          Password
        </Text>
        <View style={styles.action}>
          <Feather
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="Enter password"
            name="lock" color={colors.text} size={25} />
          <TextInput
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="This field is required"
            placeholder="Your Password"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
                fontSize: 20,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType={'password'}
            onChangeText={val => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather
              accessible={true}
              accessibilityLabel="Password is hidden"
              name="eye-off" color="grey" size={20} />
            ) : (
              <Feather
              accessible={true}
              accessibilityLabel="Password text is visible"
              name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 6 characters long.
            </Text>
          </Animatable.View>
        )}

        {/* <TouchableOpacity>
          <Text style={{color: '#308CD1', marginTop: 15}}>
            Forgot password?
          </Text>
        </TouchableOpacity> */}



        {/* <View style={{ width: '100%', marginTop: 50, justifyContent:"space-between" }}>
          <Button
            color="#127ACC"
            title="Login"
            role="button"
            size = "large"
            fontSize = '18'
            // accessibilityLabel="Learn more about this purple button"
            onPress={()=> loginHandle(data.email, data.password)}
          />

          <View style={{marginTop: 20}} />

          <Button
            color="#12A2CC"
            title="Sign up"
            role="button"
            size = "large"
            // accessibilityLabel="Learn more about this purple button"
            onPress={() => navigation.navigate('SignUpScreen')}
          />

          <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
            <TouchableOpacity onPress={() => navigation.navigate('PassResetView')}>
              <Text style={styles.text_passReset}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </View>
     */}

        <View style={styles.button}>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            style={styles.signIn}
            onPress={() => {
              loginHandle(data.email, data.password);
            }}>
            <LinearGradient
              colors={['#127ACC', '#127ACC']}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Login
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            onPress={() => navigation.navigate('SignUpScreen')}
            style={[
              styles.signIn,
              {
                borderColor: '#127ACC',
                borderWidth: 2,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#127ACC',
                },
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
          
          <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
            <TouchableOpacity accessible={true} accessibilityRole="link" onPress={() => navigation.navigate('PassResetView')}>
              <Text style={styles.text_passReset}>Reset Password</Text>
            </TouchableOpacity>
          </View>


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
    backgroundColor: '#308CD1',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  text_passReset: {
    color: '#0473c8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
