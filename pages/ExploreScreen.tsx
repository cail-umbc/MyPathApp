// React Navigate Drawer with Bottom Tab
// https://aboutreact.com/bottom-tab-view-inside-navigation-drawer/

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {Button, FlatList, View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {getSessionInfo, getTempSessionInfo} from '../services/AsyncStorageService'; 
import GlobalArraySingleton from './GlobalArraySingleton';
import SummaryCard from '../components/Cards'

const ExploreScreen = ({navigation}) => {
  const [myArray, setMyArray] = useState(GlobalArraySingleton.getItems());

  useEffect(() => {
    const updateMyArray = () => {
      setMyArray([...GlobalArraySingleton.getItems()]);
    };

    GlobalArraySingleton.eventEmitter.addListener('myArrayUpdated', updateMyArray);
    return () => {
      console.log("Inside Emitter")
      GlobalArraySingleton.eventEmitter.removeListener('myArrayUpdated', updateMyArray);
    };
  }, []);

  
  // const handlePress = (index) => {
  //   flatListRef.current.scrollToIndex({ index, animated: true });
  // };

  const formatUnixTimestamp = (unixTimestamp) => {
    const dateObject = new Date(unixTimestamp * 1000);
    const humanDate = dateObject.toLocaleString();
    return humanDate;
  }

  const formatTimestamp = (timestamp) => {
    const dateObject = new Date(timestamp);
    const humanDate = dateObject.toLocaleString();
    return humanDate;
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>Session  {parseInt(item.lid) + 1}</Text>
      <Text style={styles.description}>Start time: {formatTimestamp(parseInt(item.st))}</Text>
      <Text style={styles.description}>End time:   {formatTimestamp(parseInt(item.et))}</Text>
    </View>
  );
  
  const testSession = async() =>{
    console.log("Test session")
    console.log(GlobalArraySingleton.getLData())
    // await getTempSessionInfo()
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
          <SummaryCard prop={ {totalSessions: GlobalArraySingleton.getTotalEvents(), dataLabels: GlobalArraySingleton.getLabels(), dataValue: GlobalArraySingleton.getLData()}} />
      </View>
      <View style={{flex: 1}}>
        <View>
          <FlatList
            data={myArray}
            renderItem={renderItem}
            keyExtractor={(item) => item.lid}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#F5FCFF',
  },
  contentContainer: {
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
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
  },
});

export default ExploreScreen;