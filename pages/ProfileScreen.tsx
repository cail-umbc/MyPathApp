// React Navigate Drawer with Bottom Tab
// https://aboutreact.com/bottom-tab-view-inside-navigation-drawer/

import React, {useState, useEffect, useRef} from 'react';
import {Button, View, ScrollView, Text, TextInput, Alert, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {loadUserWheelchairInfo, getToken, deleteUserWheelchairInfo, addWheelchairInfo, getName, getID} from '../services/AsyncStorageService';
import {useAccessTokenStatus} from '../services/TokenWork';
import {useWheelchairDeleteMutation, useCreateWheelchairMutation, useWheelchairUpdateMutation} from '../services/userAuthApi';
import WheelchairsView from '../components/WheelchairsView'
import DropDownPicker from 'react-native-dropdown-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalWheelchairSingleton from './SingletonAcc/GlobalWheelchairSingleton'

const SettingScreen = ({navigation}) => {
  // variables and states 
  const [startModalVisible, setStartModalVisible] = React.useState(false);
  const curAccsTkn = useRef('');
  const name = useRef('');
  const id = useRef('');
  const [wc_identify, setWc_identify] = useState("")
  const [valueNoW, setvalueNoW] = useState(0)
  const [valueWc_wdt, setvalueWc_wdt] = useState(0)
  const [valueWc_ht, setvalueWc_ht] = useState(0)

  const [editStatus, setEditStatus] = useState(false)
  const [wcIdToEdit, setWcIdToEdit] = useState(-1)
  const [wcNameToEdit, setWcNameToEdit] = useState(-1)
  DropDownPicker.setListMode("SCROLLVIEW");

  const [data, setData] = React.useState([]);

  // load data from async storage using useEffect
  useEffect(() => {
      (async () => {
        await updateWheelchairInfo()
      })();
  }, []);

  useEffect(() => {
      (async () => {
        name.current = await getName()
        id.current = await getID()
      })();
  }, []);

  const showAlert = async (itemid) => {
    Alert.alert(
      'Alert!',
      'Are you sure you want to delete this wheelchair?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => handleDelete(itemid) }
      ],
      { cancelable: true }
    );
  };


  // useEffect(() => {
  //   if (startModalVisible) {
  //     console.log("Modal visible")
      
  //   }
  // }, [startModalVisible]);



  // update the user access token
  const UpdateAccessToken = async (suppressError) =>{
    try {
      const asyToken = await getToken();
      if (asyToken) {
        const { refresh, access } = JSON.parse(asyToken);
        curAccsTkn.current = access;
        const res = await checkAccessToken(access, refresh, suppressError);
        if (res == true){
          const asyToken = await getToken();
          if (asyToken) {
            const { refresh, access } = JSON.parse(asyToken);
            curAccsTkn.current = access;
            console.log(curAccsTkn)
          }
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error checking access token-> ', error);
      return false
    }
  }

  // update wheelchair information from the server
  const updateWheelchairInfo = async () => {
    const tokenStat = await UpdateAccessToken(true)
    if (!tokenStat){
      setData(await loadUserWheelchairInfo())
      return
    }

    console.log("User wheelchair get")
    fetch('https://mypathweb.csi.miamioh.edu/api/user/wcdata/', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + curAccsTkn.current
    }
    })
    .then(response => response.json())
    .then(data => assignWheelchairData(data))
    .catch(error => console.error(error));   
  }

  // Store/update the wheelchair information
  const assignWheelchairData = async(data) =>{
      await addWheelchairInfo(data, true)
      const wcInfos = await loadUserWheelchairInfo()
      setData(wcInfos)
      GlobalWheelchairSingleton.setArray(wcInfos)
  }

  // find a single wheelchair information using the wheelchair id
  const getObjectById = (id) => {
    const foundObject = GlobalWheelchairSingleton.getItems().find(obj => obj.id === id);
    return foundObject || null; // Return null if no object is found
  };


  // edit a wheelchair information based on the wheelchair id
  const handleEdit = (itemId)=>{
    console.log(itemId)
    
    selectedWc = getObjectById(itemId)
    if (selectedWc != null){
      setEditStatus(true)
      setWcIdToEdit(itemId)
      setWcNameToEdit(selectedWc["wc_identify"])

      setvalueTypeWc(selectedWc["type_wc"])
      setvalueDriTy(selectedWc["d_type"])
      setvalueTM(selectedWc["tire_mat"])

      setvalueNoW(selectedWc["number_w"])
      setvalueWc_wdt(selectedWc["wc_wdt"])
      setvalueWc_ht(selectedWc["wc_ht"])


      setStartModalVisible(!startModalVisible)
      console.log(selectedWc)
    }
  }

  const resetWcData = () =>{
    setvalueTypeWc(null)
    setvalueDriTy(null)
    setvalueTM(null)

    setvalueNoW(0)
    setvalueWc_wdt(0)
    setvalueWc_ht(0)
  }
  
  
  // delete a wheelchair from server and singleton array
  const checkAccessToken = useAccessTokenStatus();
  const [wheelchairDelete] = useWheelchairDeleteMutation()
  const handleDelete = async (itemId) => {

    if (GlobalWheelchairSingleton.wc.length == 1){
      alert("You have only one wheelchair listed. Add another one to delete this wheelchair.")
      return
    }

    const tokenStat = await UpdateAccessToken(false)
    if (tokenStat){
      const response = await wheelchairDelete([curAccsTkn.current, itemId])
      if (response.data){
        const updatedData = data.filter(item => item.id !== itemId);
        setData(updatedData);
        await deleteUserWheelchairInfo(itemId)

        // Update global array
        const wcData = await loadUserWheelchairInfo()
        GlobalWheelchairSingleton.setArray(wcData)

      }
    }
  };

  // render a single wheelchair information
  const renderItem = ({ item }) => (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
        <Text
        accessible={true}
        accessibilityHint={"wheelchair name " + item.wc_identify}
        style={{fontSize: 18, color: "black"}}>{item.wc_identify}</Text>
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity           
             style={{marginRight: 15}} onPress={() => handleEdit(item.id)}>
            <Text
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Edit wheelchair information"          
            style={{ fontSize: 18, color: 'blue' }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showAlert(item.id)}>
            <Text
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Delete wheelchair data"           
            style={{ fontSize: 18, color: 'red' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
  );


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



    // create a new wheelchair and send the data to the server using mutation
    const [createWheelchair] = useCreateWheelchairMutation()
    const addWheelchair = async ()=> {
      if (!wc_identify){
            alert("Wheelchair Model/Name field can not be empty")
            return
      } else if(wc_identify.trim() == ""){
            alert("Wheelchair Model/Name field can not be empty")
            return
      }

      const objectExists = GlobalWheelchairSingleton.wc.some(obj => obj.label === wc_identify.trim());

      if (objectExists) {
        alert(`Wheelchair with model/name '${wc_identify}' already exists.`);
        return
      }
            
      //GlobalWheelchairSingleton
      
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

      const tokenStat = await UpdateAccessToken(false)
      if (tokenStat){
        let userId = id.current
        const wheelchair = {type_wc: type_wc, wc_identify: wc_identify, number_w: number_w, d_type: d_type, tire_mat: tire_mat, wc_wdt: wc_wdt, wc_ht: wc_ht, user_id: userId}
        const response = await createWheelchair(wheelchair)
        if (response.data){
          alert("New Wheelchair Added!")
          setStartModalVisible(!startModalVisible)
          await updateWheelchairInfo()

          resetWcData()
        }else{
          alert("Something wrong! Please try again")
        }
      }else{
        alert("Check your internet connection")
        return
      }
    }


    // update the existing wheelchair with wheelchair update mutation
    const [wheelchairUpdate] = useWheelchairUpdateMutation()
    const editWheelchair = async()=>{

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

      const tokenStat = await UpdateAccessToken(false)
      if (tokenStat){
        let userId = id.current
        const wheelchair = {id:wcIdToEdit, type_wc: type_wc, wc_identify: wcNameToEdit, number_w: number_w, d_type: d_type, tire_mat: tire_mat, wc_wdt: wc_wdt, wc_ht: wc_ht, user_id: userId}
        console.log(wheelchair)
        const response = await wheelchairUpdate(wheelchair)
        if (response.data){
          alert("Wheelchair data updated!")
          setStartModalVisible(!startModalVisible)
          await updateWheelchairInfo()

          resetWcData()
        }else{
          alert("Something wrong! Please try again")
        }

      }else{
        alert("Check your internet connection")
        return
      }
    }


  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 16}}>
        <Text style={{fontSize: 14, color: "black"}}></Text>
        <Text style={{fontSize: 14, color: "black"}}></Text>
        <Text style={{fontSize: 18, color: "black"}}>Name:  {name.current}</Text>
        <Text style={{fontSize: 14, color: "black"}}></Text>
        <Text style={{fontSize: 14, color: "black"}}></Text>
        <Text style={{fontSize: 14, color: "black"}}></Text>
        <Text style={{fontSize: 18, color: "black"}}>Wheelchairs:</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        /> 
        
        <TouchableOpacity style={styles.addButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add new wheelchair"
          title="+ Add new wheelchair"
          onPress={() => {
            setEditStatus(false)
            resetWcData()
            setStartModalVisible(!startModalVisible)
          }}
          >
          <Text style={styles.addWcButtonText}>+ Add new wheelchair</Text>
        </TouchableOpacity>     
      
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={startModalVisible}
        onRequestClose={() => {
          // console.log('Modal has been closed.');
          setStartModalVisible(!startModalVisible);
        }}>

        <ScrollView nestedScrollEnabled={true}>
          <View 
            // nestedScrollEnabled={true}
            style={[styles.container, {flex : 1}]}
            contentContainerStyle={styles.modalContainer}
            >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={[styles.text_footer, {
                  marginTop: 5
              }]}>Wheelchair Information:</Text>
              
              {!editStatus && (
              <Text accessible={true}
                  accessibilityLabel="Enter Wheelchair model or name. This field is required" style={[styles.text_footer, {
                  marginTop: 10
              }]}>Wheelchair Model/Name *</Text>
              )}
              {!editStatus && (
                <View style={styles.action}>
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

              )}


              <View style={styles.action}>
                  <DropDownPicker placeholder="Type of the wheelchair"
                      open={openWC}
                      value={valueTypeWc}
                      items={itemsWC}
                      setOpen={setOpenWC}
                      setValue={setvalueTypeWc}
                      setItems={setItemsWC}
                      dropDownDirection="TOP"
                  />
              </View>

              <Text style={[styles.text_footer, {
                  marginTop: 10
              }]}>Number of Wheels</Text>
              <View style={styles.action}>
                  <TextInput 
                      placeholder="Number of wheels"
                      placeholderTextColor="#666666"
                      style={styles.textInput}
                      maxLength={1}
                      keyboardType='number-pad'
                      value = {valueNoW}
                      //onChangeText={text => onTextChanged(text)}
                      onChangeText={text => {
                          console.log(text)
                          setvalueNoW(text.replace(/[^0-9]/g, ''))
                      }}
                      
                  />
              </View>

              <Text style={[styles.text_footer, {
                  marginTop: 5
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
                  marginTop: 5
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
                  marginTop: 10
              }]}>Wheelchair Width (inches)</Text>
              <View style={styles.action}>
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
                  marginTop: 2
              }]}>Seat to Floor Height (inches)</Text>
              <View style={styles.action}>
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

              <TouchableOpacity
                accessible={true}
                accessibilityRole="button"
                style={styles.addButton}
                title="+ Add new wheelchair"
                onPress={() => {
                  if (editStatus){
                    editWheelchair();
                  }else{
                    addWheelchair();
                  }
                }}
                >
                <Text style={styles.addWcButtonText}>{editStatus === true ? 'Update Wheelchair' : 'Add Wheelchair'}</Text>
              </TouchableOpacity>     




              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>


      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 0,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'flex-start',
    
    paddingHorizontal: 0,        // Add horizontal padding for a gap between items
    paddingTop: 0,
    flexGrow: 1,
    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'flex-start',
    
    paddingHorizontal: 20,        // Add horizontal padding for a gap between items
    paddingTop: 20,
    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
    modalText: {
    
    fontSize: 16,
    //fontWeight: 'bold',
    color: 'black',
  },
  addButton: {                 // Set the desired width for the gap
    marginTop: 5, // Adjust the marginTop value to add the desired gap
    marginBottom: 5,
    backgroundColor: '#127ACC',
    padding: 8,
    borderRadius: 5,
  },

  addWcButtonText: {
    fontSize: 18,
    color: 'white', // Text color
    textAlign: 'center', // Center the text horizontally within the button
  },

  action: {
      flexDirection: 'row',
      marginTop: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      fontSize: 18,
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      fontSize: 17,
      color: '#05375a',
  },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    header_text: {
        color: '#05375a',
        fontSize: 18,
        // textDecorationLine: 'underline'
    },
    
});

export default SettingScreen;