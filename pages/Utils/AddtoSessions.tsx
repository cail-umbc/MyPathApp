import AsyncStorage from '@react-native-async-storage/async-storage';
import {getStartQnsAns, addTempSessionInfo} from '../../services/AsyncStorageService'; 
import GlobalArraySingleton from '../SingletonAcc/GlobalArraySingleton';

export async function onAddVirtualSessionArray (stTime, endTime, sbsStatus, eqa1, eqa2)
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
  };



export async function setStatus(runningStatus)
  {
      if(runningStatus == true)
      {
        await AsyncStorage.setItem("isRunning", "true");
      }else{
        await AsyncStorage.setItem("isRunning", "false");
      }
  }


export function ShowTime(time)
  {
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