// React Navigate Drawer with Bottom Tab
// https://aboutreact.com/bottom-tab-view-inside-navigation-drawer/

import React, {useState, useEffect, useRef} from 'react';
import {Button, View, Text, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import { useRoute } from "@react-navigation/native"
import {loadUserWheelchairInfo} from '../services/AsyncStorageService';
import WheelchairsView from '../components/WheelchairsView'


const UpdateWcScreen = ({navigation}) => {
  
  const route = useRoute()
  const wcId = route.params?.wcId

  const [data, setData] = React.useState([]);
    useEffect(() => {
      (async () => {
        const allData = await loadUserWheelchairInfo()
        
        //console.log(wheelchairs[0])
      })();
  }, []);

  const handleEdit = (itemId)=>{
    console.log(itemId)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 16}}>

      </View>
    </SafeAreaView>
  );
};

export default UpdateWcScreen;