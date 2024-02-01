import React, {useState, useEffect} from 'react';
import { 
    View, 
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
import {useRegisterUserMutation} from '../services/userAuthApi';
import Toast from 'react-native-toast-message';





const SignInScreen = ({navigation}) => {

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested',]);
    }, [])
    DropDownPicker.setListMode("SCROLLVIEW");

    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [com_num, setCom_num] = useState("")
    const [wc_identify, setWc_identify] = useState("")
    const [valueNoW, setvalueNoW] = useState(0)
    const [valueWc_wdt, setvalueWc_wdt] = useState(0)
    const [valueWc_ht, setvalueWc_ht] = useState(0)
    const [secureTextEntry, setSecureTextEntry] = useState(true)




    const clearTextInput = () => {
        setName('')
        setEmail('')
        setPassword('')
        setPassword2('')
        setCom_num('')
        setWc_identify('')
    }

    const updateSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry)
    }

    const [openGender, setOpenGender] = useState(false);
    const [valueGender, setvalueGender] = useState(null);
    const [itemsGender, setItemsGender] = useState([
      {label: 'Male', value: 'man'},
      {label: 'Female', value: 'woman'},
      {label: 'Non-binary', value: 'nb'},
      {label: 'Prefer not to respond', value: 'pn'},
    ]);

    const [openWC, setOpenWC] = useState(false);
    const [valueTypeWc, setvalueTypeWc] = useState(null);
    const [itemsWC, setItemsWC] = useState([
      {label: 'Manual Wheelchair', value: 'mawc'},
      {label: 'Powered Wheelchair', value: 'powc'},
      {label: 'Power Assist Wheelchair', value: 'pawc'},
      {label: 'Other Wheelchair', value: 'owc'},
    ]);

    const [openWT, setOpenWT] = useState(false);
    const [valueDriTy, setvalueDriTy] = useState(null);
    const [itemsWT, setItemsWT] = useState([
      {label: 'Front Wheel Drive', value: 'fwd'},
      {label: 'Mid Wheel Drive', value: 'mwd'},
      {label: 'Rear Wheel Drive', value: 'rwd'},
    ]);

    const [openTM, setOpenTM] = useState(false);
    const [valueTM, setvalueTM] = useState(null);
    const [itemsTM, setItemsTM] = useState([
      {label: 'Pneumatic', value: 'pnwc'},
      {label: 'Solid', value: 'sowc'},
      {label: 'Flat Free', value: 'ffwc'},
      {label: 'Other', value: 'other'},
    ]);

    const [openHT, setOpenHT] = useState(false);
    const [valueHeight, setvalueHeight] = useState(null);
    const [itemsHT, setItemsHT] = useState([
      {label: '0 - 40 inches', value: '0_40'},
      {label: '40 - 50 inches', value: '40_50'},
      {label: '50 - 60 inches', value: '50_60'},
      {label: '60 - 70 inches', value: '60_70'},
      {label: '70+ inches', value: '70_1000'},
    ]);

    const [openWeiT, setOpenWeiT] = useState(false);
    const [valueWeight, setvalueWeight] = useState(null);
    const [itemsWeiT, setItemsWeiT] = useState([
      {label: '0 - 130 lbs', value: '0_100'},
      {label: '130 - 160 lbs', value: '120_140'},
      {label: '160 - 190 lbs', value: '140_160'},
      {label: '190 - 220 lbs', value: '160_180'},
      {label: '220+ lbs', value: '200+'},
    ]);

    const [openAge, setOpenAge] = useState(false);
    const [valueAge, setvalueAge] = useState(null);
    const [itemsAge, setItemsAge] = useState([
      {label: 'Under 18', value: '0_20'},
      {label: '18 - 40 years', value: '20_40'},
      {label: '40 - 60 years', value: '40_60'},
      {label: '60 - 80 years', value: '60_80'},
      {label: '80+ years', value: '100_y'},
    ]);

    const isValidPass = (pass1, pass2) => {
        if(pass1.length < 6)
        {
            showAlert("password length can not be less than 6");
            return false;
        }
        if(pass2.length < 6)
        {
            showAlert("confirm password length can not be less than 6");
            return false;
        }

        if(pass1 != pass2)
        {
            showAlert("Mismatched in password and confirm password");
            return false;
        }

        return true;
    }

    const showAlert = (mgs) => {
        alert(mgs);
    }

    const [registerUser] = useRegisterUserMutation()
    const validateAndStore = async () => {
        let isError = false

        if (!name){
            showAlert("Name field can not be empty")
            isError = true
        } else if(name.trim() == ""){
            showAlert("Name field can not be empty")
            isError = true
        }

        if (!email && !isError) {
            showAlert("Email address can not be empty")
            isError = true
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) && !isError) {
            showAlert("Invalid email address")
            isError = true
        }

        if (!com_num){
            showAlert("User ID field can not be empty")
            isError = true
        } else if(com_num.trim() == ""){
            showAlert("User ID field can not be empty")
            isError = true
        }

        if (!wc_identify){
            showAlert("Wheelchair Name/Model field can not be empty")
            isError = true
        } else if(wc_identify.trim() == ""){
            showAlert("Wheelchair Name/Model field can not be empty")
            isError = true
        }

        console.log("Error state " + isError)
        if (!isError && !isValidPass(password, password2)){
            isError = true
        }

        console.log("Error state " + isError)
        let height = ""
        if (valueHeight){
            height = valueHeight
        }
        console.log("----Height----: " + height)

        let weight = ""
        if (valueWeight){
            weight = valueWeight
        }
        console.log("----Weight----: " + weight)
        
        let gender = ""
        if (valueGender){
            gender = valueGender
        }
        console.log("----Gender----: " + gender)

        let age = ""
        if (valueAge){
            age = valueAge
        }
        console.log("----Age----: " + age)
        
        let type_wc = ""
        if (valueTypeWc){
            type_wc = valueTypeWc
        }
        console.log("--Type of WC--: " + type_wc)

        let number_w = 0
        if (valueNoW){
            number_w = valueNoW
        }

        console.log("--Number of Wheel--: " + number_w)
        
        let d_type = ""
        if (valueDriTy){
            d_type = valueDriTy
        }
        console.log("--Wheel Type--: " + d_type)

        let tire_mat = ""
        if (valueTM){
            tire_mat = valueTM
        }
        console.log("--Tire Material--: " + tire_mat)

        let wc_wdt = 0
        if (valueWc_wdt){
            wc_wdt = valueWc_wdt
        }
        console.log("--WC width--: " + wc_wdt)

        let wc_ht = 0
        if (valueWc_ht){
            wc_ht = valueWc_ht
        }
        console.log("--WC height--: " + wc_ht)

        if (!isError) {
            //let wc_identify = "hello www"
            const profile = {height, weight, gender, age}
            const wheelchair = {type_wc, wc_identify, number_w, d_type, tire_mat, wc_wdt, wc_ht}
            const formData = { name, email, password, com_num, profile, wheelchair}
            console.log(formData)
            const res = await registerUser(formData)
            console.log(res)
            if (res.data){
                alert("Registration successful! Please Login");
                navigation.goBack()
            }
            console.log("Response error ------> ", res)
            if (res.error){
                console.log("Response error ------> ", res.error.data.errors)
                Toast.show({
                    type: 'info',
                    ...(res.error.data.errors.name ? {text1: "Name  " +res.error.data.errors.name[0]} : ''),
                    ...(res.error.data.errors.email ? {text1: "Email " +res.error.data.errors.email[0]} : ''),
                    ...(res.error.data.errors.password ? {text1: res.error.data.errors.password[0]} : ''),
                    ...(res.error.data.errors.password2 ? {text1: res.error.data.errors.password2[0]} : ''),
                    ...(res.error.data.errors.non_field_errors ? {text1: res.error.data.errors.non_field_errors[0]} : ''),
                })
            }
        }
    }

    return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
        {/* change color */}
      <View style={styles.container}>
          <StatusBar backgroundColor='#308CD1' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now</Text>
        </View>
        
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
        <Toast/>
        <ScrollView nestedScrollEnabled={true}>

            <Text accessibilityLabel="Full Name, this field is required" style={styles.text_footer}>Full Name *</Text>
            <View accessibilityLabel="full name" style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={23}
                />
                <TextInput 
                    accessible={true}
                    accessibilityRole="none"
                    // accessibilityHint="required"
                    accessibilityLabel="This field is required"
                    placeholder="Full Name"
                    placeholderTextColor="#666666"
                    
                    style={styles.textInput}
                    autoCapitalize="none"
                    value = {name}
                    onChangeText = {setName}
                />
            </View>

            <Text accessibilityLabel="Email, this field is required" style={[styles.text_footer, {
                marginTop: 20
            }]}>Email *</Text>
            <View accessibilityLabel="email" style={styles.action}>
                <FontAwesome 
                    name="envelope-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    accessible={true}
                    accessibilityRole="none"
                    accessibilityLabel="This field is required"
                    // accessibilityHint="required"
                    placeholder="example@email.com"
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    autoCapitalize="none"
                    value = {email}
                    onChangeText={setEmail}
                />
            </View>

            <Text accessibilityLabel="Password, this field is required"  style={[styles.text_footer, {
                marginTop: 20
            }]}>Password *</Text>
            <View accessibilityLabel="password" style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    accessible={true}
                    accessibilityRole="none"
                    accessibilityLabel="This field is required"
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry= {secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    value = {password}
                    onChangeText = {setPassword}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {secureTextEntry ? 
                    <Feather
                        accessible={true}
                        accessibilityLabel="Password is hidden"
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather
                        accessible={true}
                        accessibilityLabel="Password text is visible" 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>

            <Text accessibilityLabel="Enter password again, this field is required" style={[styles.text_footer, {
                marginTop: 20
            }]}>Confirm Password *</Text>
            <View accessibilityLabel = "confirm password" style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    accessible={true}
                    accessibilityRole="none"
                    accessibilityLabel="This field is required"
                    placeholder="Confirm Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    value = {password2}
                    onChangeText = {setPassword2}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {secureTextEntry ? 
                    <Feather 
                        accessible={true}
                        accessibilityLabel="Password is hidden"
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        accessible={true}
                        accessibilityLabel="Password text is visible"
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>


            <Text accessibilityLabel="User ID, this field is required. Contact MyPath team if you don't have the ID" style={[styles.text_footer, {
                marginTop: 20
            }]}>User ID *</Text>
            <View accessibilityLabel="User ID field" style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={23}
                />
                <TextInput 
                    accessible={true}
                    accessibilityRole="none"
                    accessibilityLabel="This field is required"
                    placeholder="Enter your ID"
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    autoCapitalize="none"
                    value = {com_num}
                    onChangeText = {setCom_num}
                />

                
            </View>
            <Text style={styles.simple_text}>Contact MyPath team if you don't have the ID</Text>


            {/* Height */}
            <Text style={[styles.header_text, {
                marginTop: 30
            }]}>Other Information</Text>
            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Height</Text>

            <View style={styles.action}>
                <DropDownPicker accessible={true} placeholder="Height (Inch)"
                    open={openHT}
                    value={valueHeight}
                    items={itemsHT}
                    setOpen={setOpenHT}
                    setValue={setvalueHeight}
                    setItems={setItemsHT}
                    dropDownDirection="TOP"
                />
            </View>


            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Weight</Text>
            <View style={styles.action}>
                <DropDownPicker placeholder="Weight (lb)"
                    open={openWeiT}
                    value={valueWeight}
                    items={itemsWeiT}
                    setOpen={setOpenWeiT}
                    setValue={setvalueWeight}
                    setItems={setItemsWeiT}
                    dropDownDirection="TOP"
                />
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Gender</Text>
            
            <View style={styles.action}>
                <DropDownPicker 
                    open={openGender}
                    value={valueGender}
                    items={itemsGender}
                    setOpen={setOpenGender}
                    setValue={setvalueGender}
                    setItems={setItemsGender}
                    dropDownDirection="TOP"
                />
            </View>
            
            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Age</Text>

            <View style={styles.action}>
                <DropDownPicker placeholder="Age"
                    open={openAge}
                    value={valueAge}
                    items={itemsAge}
                    setOpen={setOpenAge}
                    setValue={setvalueAge}
                    setItems={setItemsAge}
                    dropDownDirection="TOP"
                />
            </View>

           
           

           
            <Text style={[styles.header_text, {
                marginTop: 50
            }]}>Wheelchair Information</Text>
                <Text accessibilityLabel="Wheelchair model or name, this field is required" style={[styles.text_footer, {
                marginTop: 20
            }]}>Wheelchair Model/Name *</Text>
            <View accessibilityLabel="required" style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={23}
                />
                <TextInput 
                    accessible={true}
                    accessibilityRole="none"
                    accessibilityLabel="This field is required"
                    placeholder="Any info to identify the wheelchair"
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    autoCapitalize="none"
                    value = {wc_identify}
                    onChangeText = {setWc_identify}
                />
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Type of the Wheelchair</Text>
            <View style={styles.action}>
                <View style={styles.action}>
                    <DropDownPicker 
                        open={openWC}
                        value={valueTypeWc}
                        items={itemsWC}
                        setOpen={setOpenWC}
                        setValue={setvalueTypeWc}
                        setItems={setItemsWC}
                        dropDownDirection="TOP"
                    />
                </View>
            </View> 

            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Number of Wheels</Text>
            <View style={styles.action}>
                <FontAwesome
                    accessibilityLabel="number of wheels" 
                    name="wheelchair"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    accessible={true}
                    accessibilityRole="none"
                    accessibilityLabel=""
                    placeholder="Number of wheels"
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    maxLength={1}
                    keyboardType='number-pad'
                    //onChangeText={text => onTextChanged(text)}
                    onChangeText={text => {
                        console.log(text)
                        setvalueNoW(text.replace(/[^0-9]/g, ''))
                    }}
                    value = {valueNoW}
                />
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Drive Type</Text>
            <View style={styles.action}>
                <DropDownPicker 
                    open={openWT}
                    value={valueDriTy}
                    items={itemsWT}
                    setOpen={setOpenWT}
                    setValue={setvalueDriTy}
                    setItems={setItemsWT}
                    dropDownDirection="TOP"
                />
            </View> 

            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Tire Material</Text>
            <View style={styles.action}>
                <DropDownPicker 
                    open={openTM}
                    value={valueTM}
                    items={itemsTM}
                    setOpen={setOpenTM}
                    setValue={setvalueTM}
                    setItems={setItemsTM}
                    dropDownDirection="TOP"
                />
            </View> 


            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Wheelchair Width (inches)</Text>
            <View style={styles.action}>
                <FontAwesome
                    name="wheelchair"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    
                    placeholder="wheel chair width (inches)"
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType = 'number-pad'
                    maxLength={3}
                    value = {valueWc_wdt}
                    onChangeText={text => {
                        setvalueWc_wdt(text.replace(/[^0-9]/g, ''))
                    }}
                    // onChangeText = {setvalueWc_wdt}
                    // onChangeText={(val) => textInputChange(val)}
                />
            </View>


            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Seat to Floor Height (inches)</Text>
            <View style={styles.action}>
                <FontAwesome
                    name="wheelchair"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Seat to floor height (inches)"
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType = 'number-pad'
                    maxLength={3}
                    value = {valueWc_ht}
                    onChangeText={text => {
                        setvalueWc_ht(text.replace(/[^0-9]/g, ''))
                    }}
                    // onChangeText={(val) => textInputChange(val)}
                />
            </View>

            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                    By signing up you agree to our 
                </Text>
                <Text accessible={true}
                    accessibilityRole="link" style={[styles.color_textPrivate, {fontWeight: 'bold'}]}
                    onPress={() => Linking.openURL('https://docs.google.com/document/d/1NwtI7EIH2jD8wQZveEcx0KPXWzS880eBYcwRQ9a9pMM/edit?usp=sharing')}>
                    {" "} Privacy Policy
                </Text>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    accessible={true}
                    accessibilityRole="button"
                    style={styles.signIn}
                    //onPress={() => saveData("STORAGE_KEY", "test val")}
                    onPress={() => validateAndStore()}
                >
                <LinearGradient
                    colors={['#308CD1', '#308CD1']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Sign Up</Text>
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    accessible={true}
                    accessibilityRole="button"
                    onPress={() => navigation.goBack()}
                    //onPress={() => readData("userName")}

                     // change color
                    style={[styles.signIn, {
                        borderColor: '#308CD1',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    {/* change color */}
                    <Text style={[styles.textSign, {
                        color: '#308CD1'
                    }]}>Sign In</Text>
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
    // change color
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
        color: '#0473c8',
        fontSize: 18
    },
    header_text: {
        color: '#05375a',
        fontSize: 22,
        // textDecorationLine: 'underline'
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        fontSize: 23,
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        fontSize: 18,
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
        color: 'grey',
    },
    simple_text: {
        fontSize: 18,
    },
  });
