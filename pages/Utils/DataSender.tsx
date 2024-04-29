import {useSensDataMutation, useSessionDataMutation} from '../../services/userAuthApi';
import {createTempSessionInfo, getTempSessionInfo} from '../../services/AsyncStorageService'; 

const [sessionDataToServer] = useSessionDataMutation()
export async function sendSessionToServer ()
  {
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