import React, { useEffect, useRef, useState } from 'react';
import {ScrollView, Alert, BackHandler, Modal, Button, Linking, PermissionsAndroid, Platform, StyleSheet, Switch, Text, ToastAndroid, TouchableOpacity, Pressable, View, SafeAreaView} from 'react-native';
//import { ScrollView } from 'react-native-virtualized-view'
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import {accelerometer, magnetometer, gyroscope, barometer, setUpdateIntervalForType, SensorTypes} from 'react-native-sensors';
import BackgroundTimer from 'react-native-background-timer';
import {useSensDataMutation, useSessionDataMutation} from '../services/userAuthApi';
import MapView from './MapView';
import appConfig from '../app.json';
const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
import BackgroundJob from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadUserWheelchairInfo, createTempSessionInfo, getTempSessionInfo, addTempSessionInfo, addSessionInfo, getID, setDataCollectStartTime, getDataCollectStartTime, getSessionInfo, addStartQnsAns, getStartQnsAns} from '../services/AsyncStorageService'; 
import CustomBtn from '../components/CustomBtn'
import GlobalArraySingleton from './GlobalArraySingleton';
import GlobalWheelchairSingleton from './GlobalWheelchairSingleton';
import { getDistance } from 'geolib';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Realm from 'realm';

const TaskSchema = {
 name: 'senData',
 properties: {
   time_stamp: 'int',
   e: 'string',
   ax: 'string',
   ay: 'string',
   az: 'string',
   gx: 'string',
   gy: 'string',
   gz: 'string',
   mx: 'string',
   my: 'string',
   mz: 'string',
   lat: 'string',
   lng: 'string',
   p: 'string',
   s: 'string',
 },
 primaryKey: 'time_stamp',
};

const HomeScreen = ({navigation}) => {
  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(true);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState<GeoPosition | null>(null);

  const watchId = useRef<number | null>(null);

  const sensorSubscriptionAcc = useRef();
  const sensorSubscriptionGyr = useRef();
  const sensorSubscriptionMag = useRef();

  const realm = useRef(null);

  const ax = useRef(0.0);
  const ay = useRef(0.0);
  const az = useRef(0.0);
  const gx = useRef(0.0);
  const gy = useRef(0.0);
  const gz = useRef(0.0);
  const mx = useRef(0.0);
  const my = useRef(0.0);
  const mz = useRef(0.0);
  const p = useRef(0.0);
  const lat = useRef(0.0);
  const lng = useRef(0.0);
  const ev = useRef("-");

  const ttl = useRef(0);

  const [isRunning, setIsRunning] = useState(true);
  const [startModalVisible, setStartModalVisible] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  const phonePosQues = ["Attached to Lap Tray", "Attached to Frame", "Attached to Arm Rest", "In Pocket", "In Lap", "In Backpack", "Others"]
  const difficultyQues = ["Easy", "Somewhat Easy", "Somewhat difficult", "Difficult", "Very Difficult"]
  const tripFreqQues = ["I will be taking this trip frequently.", "I will be taking this route infrequently.", "This is a single-use route."]
  const familiarityRoadQues = ["I am highly familiar with this route/location.", "I am somewhat familiar with this route/location.", "I am not familiar at all with this route/location."]
  const uegencyQues = ["I must be on time, or this route is time-sensitive.", "There is some flexibility on my arrival time", "I have lots of flexibility on my arrival time."]

  DropDownPicker.setListMode("SCROLLVIEW");


  useEffect(() => {
   (async () => {
     const realmm = await Realm.open({
       path: 'myrealm',
       schema: [TaskSchema],
     }).then(realmm => {
       realm.current = realmm
     });
   })();
  }, []);

  useEffect(() => {
    return () => {
      stopLocationUpdates();
    };
  }, []);

  useEffect(() => {
    DataRestore();
  }, []);

  const MINUTE_MS = 10000;
  useEffect(() => {
    const interval = setInterval(() => {
       (async () => {
          sendDataToServer();
          sendSessionToServer();
        })();
    }, MINUTE_MS);
    return () => clearInterval(interval);
  }, [])

  // useEffect(() => {
  //   const backAction = () => {
  //     if (modalVisible) {
  //       return false;
  //     }
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  //   return () => backHandler.remove();
  // }, [modalVisible]);

  // useEffect(() => {
  //   const backAction = () => {
  //     console.log("Inside back button")
  //     if (startModalVisible) {
  //       //setStartModalVisible(false)
  //       return false;
  //     }
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  //   return () => backHandler.remove();
  // }, [startModalVisible]);


  let tmpWcItemsData = null
  const [wcData, setWcData] = React.useState([]);
  const [openWc, setOpenWc] = useState(false);
  const [valueWc, setValueWc] = useState(null);
  const [itemsWc, setItemsWc] = useState();

  const stopLocationUpdates = () => {
    if (Platform.OS === 'android') {
      VIForegroundService.getInstance()
        .stopService()
        .catch((err: any) => err);
    }
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setObserving(false);
    }
    sensorUnsubscribe();
  };

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }
    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }
    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }
    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };
  
  const [backgroundTimerId, setBackgroundTimerId] = useState(0)
  const onBackgroundTimer = async () => {
    const curTime = Date.now()
    await setDataCollectStartTime(curTime);
    const intervalId = BackgroundTimer.setInterval(() => {
      StoreData();
    }, 15);
    setBackgroundTimerId(intervalId)
  }

  const StoreData = async() => {
    try {
      realm.current.write(() => {
        var task1 = realm.current.create('senData', {
          time_stamp: Date.now(),
          e: ev.current + '',
          ax: ax.current.toFixed(8) + '',
          ay: ay.current.toFixed(8) + '',
          az: az.current.toFixed(8) + '',
          gx: gx.current.toFixed(8) + '',
          gy: gy.current.toFixed(8) + '',
          gz: gz.current.toFixed(8) + '',
          mx: mx.current.toFixed(8) + '',
          my: my.current.toFixed(8) + '',
          mz: mz.current.toFixed(8) + '',
          lat: lat.current.toFixed(8) + '',
          lng: lng.current.toFixed(8) + '',
          p: p.current.toFixed(8) + '',
          s: '0',
        });
        
      });
    } catch (Error) {
      console.log(Error);
    }
  };

  const onStopBackgroundTimer = async () =>{
    BackgroundTimer.stop();
    BackgroundTimer.clearInterval(backgroundTimerId);
    await BackgroundJob.stop();
    const startTime = await getDataCollectStartTime();
    const curTime = Date.now()
    const elpTime = curTime - parseInt(startTime);

    const dis = getTotalDistance()
    await addSessionInfo(startTime, curTime, dis)
    setSessionData(startTime, curTime, elpTime, dis)
  }

  const getTotalDistance = () =>{
    return -1
  }

  const [stTime, setstTime] = React.useState(0);
  const [endTime, setendTime] = React.useState(0);
  const [sbsStatus, setsbsStatus] = React.useState(0);
  const [elpTime, setelpTime] = React.useState("");
  const setSessionData = async(startTime, curendTime, curelpTime, sessionBackupStatus) =>
  {
    setstTime(startTime)
    setendTime(curendTime)
    setsbsStatus(sessionBackupStatus)
    setelpTime(curelpTime)
  }

  const storeSensorData = async(value)=>{
    setUpdateIntervalForType(SensorTypes.accelerometer, 15);
    setUpdateIntervalForType(SensorTypes.gyroscope, 15);
    setUpdateIntervalForType(SensorTypes.magnetometer, 15);

    try {
       sensorSubscriptionAcc.current = accelerometer.subscribe(
         ({x, y, z, timestamp}) => {
           //console.log(x);
           ax.current = x;
           ay.current = y;
           az.current = z;
         },
       );
     } catch (error) {}

    try {
       sensorSubscriptionGyr.current = gyroscope.subscribe(
         ({x, y, z, timestamp}) => {
           gx.current = x;
           gy.current = y;
           gz.current = z;
         },
       );
     } catch (error) {}

    try {
       sensorSubscriptionMag.current = magnetometer.subscribe(
         ({x, y, z, timestamp}) => {
           mx.current = x;
           my.current = y;
           mz.current = z;
         },
       );
     } catch (error) {}
  }

  const sensorUnsubscribe = async () =>{
    if (sensorSubscriptionAcc.current != null){
      sensorSubscriptionAcc.current.unsubscribe();
      sensorSubscriptionAcc.current = null;
    }

    if (sensorSubscriptionGyr.current != null)
    {
      sensorSubscriptionGyr.current.unsubscribe();
      sensorSubscriptionGyr.current = null;
    }

    if (sensorSubscriptionMag.current != null)
    {
      sensorSubscriptionMag.current.unsubscribe();
      sensorSubscriptionMag.current = null;
    }
  }

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      return;
    }

    if (Platform.OS === 'android' && foregroundService) {
      await startForegroundService();
    }

    storeSensorData();
    setObserving(true);
    watchId.current = Geolocation.watchPosition(
      position => {
        setLocation(position);
        lat.current = position.coords.latitude;
        lng.current = position.coords.longitude;

        //positionData.push({latitude: lat.current, longitude: lng.current})
        console.log("<====================>")
        console.log(position);
        // console.log("<====================>")
      },
      error => {
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        distanceFilter: 0,
        interval: 3000,
        fastestInterval: 2000,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
        useSignificantChanges: significantChanges,
      },
    );
  };

  const startForegroundService = async () => {
    if (Platform.Version >= 26) {
      await VIForegroundService.getInstance().createNotificationChannel({
        id: 'locationChannel',
        name: 'Location Tracking Channel',
        description: 'Tracks location of user',
        enableVibration: false,
      });
    }

    return VIForegroundService.getInstance().startService({
      channelId: 'locationChannel',
      id: 420,
      title: appConfig.displayName,
      text: 'Tracking location updates',
      icon: 'ic_launcher',
    });
  };

  const [sensData] = useSensDataMutation()
  const sendDataToServer = async() =>{
    const availableData = realm.current.objects('senData').sorted('time_stamp', false);

    if (availableData == null){
      return
    } 
    if (availableData.length > 0){
      let first_num = availableData[0].time_stamp
      let last_num = first_num + 70000

      const sendata = realm.current.objects("senData").filtered(
        first_num + " <= time_stamp && time_stamp <= " + last_num
      );

      const res = await sensData(sendata)

      if (res.data){
        console.log("--> ",sendata.length)
        realm.current.write(() => {
          realm.current.delete(sendata);});
      }else{
      }
    }
  }

  const [sessionDataToServer] = useSessionDataMutation()
  const sendSessionToServer = async() => {
    const sessionData = await getTempSessionInfo()
    if (sessionData.length > 0){
      console.log("Session data sent to server")
      console.log(sessionData)
      const res = await sessionDataToServer(sessionData)
      if (res.data){
        await createTempSessionInfo([])
      }else{
      }
    }else{
    }
  }

  const options = {
    taskName: 'MyPath',
    taskTitle: 'MyPath',
    taskDesc: 'MyPath background service is running',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'exampleScheme://chat/jane',
    parameters: {
      delay: 20,
    },
  };

  BackgroundJob.on('expiration', () => {
   console.log('iOS: I am being closed!');
  });
  
  const RequestLoc = async () =>{
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          lat.current = position.coords.latitude;
          lng.current = position.coords.longitude;

          console.log("Main Pos")
          console.log(position);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: highAccuracy, timeout: 10000, maximumAge: 5000 }
    );
  }

  const taskRandom = async (taskData) => {
     if (Platform.OS === 'ios') {
         console.warn(
             'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
             'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
         );
     }
     
     console.log("TaskRandom")
     await new Promise(async (resolve) => {
         for (let i = 0; BackgroundJob.isRunning(); i++) {
           if (i%100 == 0)
           {
             RequestLoc()
           }
           StoreData();
           await sleep(15);
         }
     });
  };

  const ShowTime = (time) =>{
    time = time / 1000
    const h = parseInt((time/3600) + "")  ;
    const m = parseInt(((time % 3600) / 60) + "");
    const s = parseInt(time % 3600 % 60);

    if (h == 0 && m == 0){
      return "Data collected for "+ s + " seconds"
    }else if(h == 0){
      return "Data collected for "+ m + " min and "+ s + " seconds! Thank you!"
    }else{
      return "Data collected for " + h + " hours" + m + " min and "+ s + " seconds! Thank you"
    }
  }

  const toggleBackground = async state => {
   if (state) {
     try {
       storeSensorData();
       const curTime = Date.now()
       await setDataCollectStartTime(curTime);
       await BackgroundJob.start(taskRandom, options);
     } catch (e) {
       //console.log('Error', e);
     }
   } else {
     sensorUnsubscribe();
     await BackgroundJob.stop();
     const startTime = await getDataCollectStartTime();
     const curTime = Date.now()
     const elpTime = curTime - parseInt(startTime);

     const dis = getTotalDistance()
     await addSessionInfo(startTime, curTime, dis)
     setSessionData(startTime, curTime, elpTime, dis)
   }
  };

  const checkId = async() =>{
    const userId = await getID()
    console.log("User id-------------", userId)
    ev.current = userId
  }

  const setStatus = async (runningStatus) => {
      if(runningStatus == true)
      {
        await AsyncStorage.setItem("isRunning", "true");
      }else{
        await AsyncStorage.setItem("isRunning", "false");
      }
  }

  const DataRestore = async () => {
    const statusRun = await AsyncStorage.getItem("isRunning");
    if (statusRun !== null) {
        let res = JSON.parse(statusRun);
        setIsRunning(res);
        // console.log("status run: " + statusRun);
        // if (!statusRun){
        //   stopLocationUpdates()
        //   getLocationUpdates()
        // }
    }else{
        //console.log("else status run: " + statusRun);
    }
  };

  const onAddVirtualSessionArray = async(eqa1, eqa2) =>
  { 
    console.log("Global array logged")
    GlobalArraySingleton.addIntoArray(stTime, endTime, sbsStatus)
    console.log("Add into array END")
    const res = await getStartQnsAns()
    console.log(res)
    const wcId = res[0]
    const sqa1 = res[1]
    const sqa2 = res[2]
    const sqa3 = res[3]
    await addTempSessionInfo(stTime, endTime, sbsStatus, wcId, sqa1, sqa2, sqa3, eqa1, eqa2, "Nov_8_23")
  }

  const startModalPosSelect = async (qAns1, qAns2, qAns3) => {
    if (valueWc === null){
      alert("Please select a wheelchair")
      return
    }
    setStartModalVisible(!startModalVisible);
    await addStartQnsAns([valueWc, qAns1, qAns2, qAns3])

    if (Platform.OS === 'ios'){
      setIsRunning(!isRunning)
      getLocationUpdates();
      onBackgroundTimer();
    }else{
      setStatus(!isRunning);
      setIsRunning(!isRunning)
      toggleBackground(isRunning);
    }

    // Reset the wheelchair selection
    setValueWc(null)
  }

  const phonePosSelect = async (endQAns1, endQAns2) => {
    console.log("Question ans1 " + endQAns1)
    console.log("Question ans2 " + endQAns2)
    setModalVisible(!modalVisible)
    await onAddVirtualSessionArray(endQAns1, endQAns2)
  }

//  const loadWheelchairInfo = async () =>{
//     const tempData = GlobalWheelchairSingleton.getItems()
//     setWcData(tempData)
//     console.log("==================")
//     console.log(wcData)
//     tmpWcItemsData = wcData.map(item => ({
//       label: item.wc_identify,
//       value: item.id,
//     }));
//     console.log(tmpWcItemsData)
//     setItemsWc(tmpWcItemsData)
//  }




  const [selectedPosSq1, setSelectedPosSq1] = useState("1"); 
  const [selectedPosSq2, setSelectedPosSq2] = useState("1"); 
  const [selectedPosSq3, setSelectedPosSq3] = useState("1"); 

  const [selectedPosEq1, setSelectedPosEq1] = useState("1"); 
  const [selectedPosEq2, setSelectedPosEq2] = useState("1"); 

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{flex : 1.5}}>
        <MapView coords={location?.coords || null} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={startModalVisible}
        onRequestClose={() => {
          // console.log('Modal has been closed.');
          setStartModalVisible(!startModalVisible);
        }}>

          
        <ScrollView 
        style={[styles.container, {flex : 1}]}
        contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text></Text>
                <Text style={styles.modalText}>
                Please answer the following questions:
                </Text>
                <Text></Text>
                <Text></Text>
                <Text style={styles.modalText}>Which wheelchair you will be using?</Text>
                <View style={styles.action}>
                    <DropDownPicker placeholder="Select Wheelchair"
                        open={openWc}
                        value={valueWc}
                        items={GlobalWheelchairSingleton.wc}
                        setOpen={setOpenWc}
                        setValue={setValueWc}
                        setItems={setItemsWc}
                        dropDownDirection="TOP"
                    />
                </View>
                  <View >
                    <TouchableOpacity
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Add new wheelchair"
                      style={styles.addButton}
                      title="+ Add new wheelchair"
                      onPress={() => {
                        alert("Click on the \"+ Add new wheelchair\" button to add another wheelchair")
                        setStartModalVisible(!startModalVisible);
                        navigation.navigate('ProfileScreenStack')}}
                      >
                      <Text style={styles.addWcButtonText}>+ Add new wheelchair</Text>
                    </TouchableOpacity>
                    
                    <Text></Text>
                    <Text style={styles.modalText}>1. How Frequently will you be taking this trip?</Text>
                    <RadioButton.Group >
                      {[0, 1, 2].map(pos => (
                        <TouchableOpacity
                          onPress={() => {
                              console.log("sq1T")
                              console.log(pos.toString());
                              setSelectedPosSq1(pos.toString());
                            }}
                          key={pos} style={styles.radioButton}>
                          <RadioButton.Android
                            value={pos.toString()}
                            status={selectedPosSq1 === pos.toString() ? 'checked' : 'unchecked'}
                            onPress={() => {
                              console.log("sq1")
                              console.log(pos.toString());
                              setSelectedPosSq1(pos.toString());
                            }}
                          />
                          <Text style={styles.radioText}>{`${tripFreqQues[pos]}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </RadioButton.Group >


                    <Text></Text>
                    <Text style={styles.modalText}>2. What is your familiarity with this route/location?</Text>
                    <RadioButton.Group >
                      {[0, 1, 2].map(pos => (
                        <TouchableOpacity
                          onPress={() => {
                              console.log("sq2T")
                              console.log(pos.toString());
                              setSelectedPosSq2(pos.toString());
                            }}
                          key={pos} style={styles.radioButton}>
                          <RadioButton.Android
                            value={pos.toString()}
                            status={selectedPosSq2 === pos.toString() ? 'checked' : 'unchecked'}
                            onPress={() => {
                              console.log("sq2")
                              console.log(pos.toString());
                              setSelectedPosSq2(pos.toString());
                            }}
                          />
                          <Text style={styles.radioText}>{`${familiarityRoadQues[pos]}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </RadioButton.Group >

                    <Text></Text>
                    <Text style={styles.modalText}>3. What is your urgency of destination arrival time?</Text>
                    <RadioButton.Group >
                      {[0, 1, 2].map(pos => (
                        <TouchableOpacity key={pos}
                          onPress={() => {
                              console.log("sq3T")
                              console.log(pos.toString());
                              setSelectedPosSq3(pos.toString());
                            }}
                          style={styles.radioButton}>
                          <RadioButton.Android
                            value={pos.toString()}
                            status={selectedPosSq3 === pos.toString() ? 'checked' : 'unchecked'}
                            onPress={() => {
                              console.log("sq3")
                              console.log(pos.toString());
                              setSelectedPosSq3(pos.toString());
                            }}
                          />
                          <Text style={styles.radioText}>{`${uegencyQues[pos]}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </RadioButton.Group >

                    <Text></Text>
                    {/* <Button
                      title="Start Collecting Data"
                      onPress={() => {
                        startModalPosSelect(selectedPosSq1, selectedPosSq2, selectedPosSq3);
                      }} */}

                      <TouchableOpacity
                          accessible={true}
                          accessibilityRole="button"
                          style={styles.modalStartButton}
                          title="Start Collecting Data"
                          onPress={() => startModalPosSelect(selectedPosSq1, selectedPosSq2, selectedPosSq3)}
                        >
                        <Text style={styles.addWcButtonText}>Start Collecting Data</Text>
                      </TouchableOpacity>
                    
                  </View>
                
            </View>
          </View>
        </ScrollView>
      </Modal>



      <ScrollView
        style={[styles.container, {flex : 1}]}
        contentContainerStyle={styles.contentContainer}>

        <View style={styles.buttonContainer}>
          <View style={styles.buttons}>
            <CustomBtn
              title={isRunning ? '"Start" Data Collection' : '"Stop" Data Collection'}
              onPress={() => {
                checkId();
                
                if (Platform.OS === 'ios') {
                  if(isRunning){
                    //loadWheelchairInfo()
                    setStartModalVisible(!startModalVisible)
                  }else{
                    setIsRunning(!isRunning)
                    stopLocationUpdates();
                    onStopBackgroundTimer();
                    setModalVisible(!modalVisible)
                  }
                }else{
                  if(isRunning){
                    //loadWheelchairInfo()
                    setStartModalVisible(!startModalVisible)
                  }else{
                    setStatus(!isRunning);
                    setIsRunning(!isRunning)
                    //stopLocationUpdates()
                    toggleBackground(isRunning);
                    setModalVisible(!modalVisible)
                  }
                }
              }}
            />
          </View>
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // console.log('Modal has been closed.');
            // setModalVisible(!modalVisible);
          }}>
        <ScrollView 
          style={[styles.container, {flex : 1}]}
          contentContainerStyle={styles.modalContainer}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTextTop}>
                Please answer the following questions
              </Text>
              <Text style={styles.modalText}>How difficult was this road?</Text>
              <RadioButton.Group>
                {[0, 1, 2, 3, 4].map(pos => (
                  <TouchableOpacity
                    onPress={() => {
                        setSelectedPosEq1(pos.toString());
                    }}
                    key={pos} style={styles.radioButton}>
                    <RadioButton.Android
                      value={pos.toString()}
                      status={selectedPosEq1 === pos.toString() ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSelectedPosEq1(pos.toString());
                      }}
                    />
                    <Text style={styles.modalText}>{`${pos+1}. ${difficultyQues[pos]}`}</Text>
                  </TouchableOpacity>
                ))}
              </RadioButton.Group>
              
              <Text></Text>
              <Text style={styles.modalText}>Where did you place your phone?</Text>
              <RadioButton.Group>
                {[0, 1, 2, 3, 4, 5, 6].map(pos => (
                  <TouchableOpacity
                    onPress={() => {
                        setSelectedPosEq2(pos.toString());
                    }}
                    key={pos} style={styles.radioButton}>
                    <RadioButton.Android
                      value={pos.toString()}
                      status={selectedPosEq2 === pos.toString() ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSelectedPosEq2(pos.toString());
                      }}
                    />
                    <Text style={styles.modalText}>{`${phonePosQues[pos]}`}</Text>
                  </TouchableOpacity>
                ))}
              </RadioButton.Group>
              
              <TouchableOpacity style={styles.modalSubmitButton}
                  accessible={true}
                  accessibilityRole="button"
                  title="Submit"
                  onPress={() => {
                    phonePosSelect(selectedPosEq1, selectedPosEq2);
                    setModalVisible(!modalVisible);
                  }}
                >
                <Text style={styles.addWcButtonText}>Submit</Text>
              </TouchableOpacity>


            </View>
          </View>
        </ScrollView>
        </Modal>
        

        {Platform.OS === 'android' &&(
        <View style={styles.bottomView}>
          <Text style={styles.black}>
            To log location data you must set location access permission to
            "Allow all the time".
          </Text>
          <Button
            accessible={true}
            accessibilityRole="button"
            title="Change Location Access Permission"
            type="Error"
            color="#3E5452"
              onPress={() => Linking.openSettings()}
          />
          <Text/>
        </View>  
        )}
      </ScrollView>
    </SafeAreaView>
  );

};


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container: {
    backgroundColor: '#F5FCFF',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  fixToText: {
    flexDirection: 'column',
    justifyContent: 'center',  // Center buttons horizontally
    marginTop: 10,
    paddingHorizontal: 10,
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
  addButton: {                 // Set the desired width for the gap
    marginTop: 5, // Adjust the marginTop value to add the desired gap
    marginBottom: 5,
    backgroundColor: '#2DAFD2',
    padding: 8,
    borderRadius: 5,
  },
  modalStartButton: {                 // Set the desired width for the gap
    marginTop: 5, // Adjust the marginTop value to add the desired gap
    marginBottom: 10,
    backgroundColor: '#2DAFD2',
    padding: 8,
    borderRadius: 5,
  },
  modalSubmitButton: {                 // Set the desired width for the gap
    marginTop: 5, // Adjust the marginTop value to add the desired gap
    marginBottom: 10,
    backgroundColor: '#2DAFD2',
    padding: 8,
    borderRadius: 5,
    width: '100%',
  },
  modalText: {
    
    fontSize: 16,
    //fontWeight: 'bold',
    color: 'black',
  },

  radioText: {
    flex: 1,
    fontSize: 16,
    //fontWeight: 'bold',
    color: 'black',
  },
  modalTextTop: {
    color: 'black',
    fontSize: 15,
    
  },
  buttonText: {
    textTransform: 'none', // Disable automatic capitalization
  },
  addWcButtonText: {
    color: 'white', // Text color
    textAlign: 'center', // Center the text horizontally within the button
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end', // Align content at the bottom
    alignItems: 'center',       // Center content horizontally
    padding: 20,                // Add padding for spacing
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

  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },

  // containert: {
  //   flex: 1,  // Make the container take up all available space
  //   paddingRight: 25
  // },
  // contentContainert: {
  //   paddingHorizontal: 16, // Add horizontal padding to content for spacing from edges
  // },
});

export default HomeScreen;