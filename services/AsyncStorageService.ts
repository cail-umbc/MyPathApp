import AsyncStorage from '@react-native-async-storage/async-storage';

    const storeToken = async (value) => {
        try {
            console.log("==== Token ====")
            console.log(value)
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('token', jsonValue)
        } catch (e) {
            alert('Failed to save the TOKEN to the storage')
        }
    }


    const getToken = async (value) => {
        try {
            const token = await AsyncStorage.getItem('token')
            if (token !== null)
            {
                return token
            }
        } catch (e) {
            //alert('Failed to get the TOKEN to the storage')
        }
    }

    const removeToken = async (value) => {
        try {
            await AsyncStorage.removeItem('token')
        } catch (e) {
            //alert('Failed to remove the TOKEN from the storage')
        }
    }




    const setFirstTimeLoggedIn = async(value) => {
        try{
            await AsyncStorage.setItem('firstTime', value)
        }catch (e) {
            console.log(e)
        }
    }


    const checkUserFirstTimeFlag = async() => {
        try {
            let value = await AsyncStorage.getItem('firstTime');
            if (value != null){
                return true
            }
            else {
                return false
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    const checkFirstTimeLoggedIn = async () => {
        try{
            const isFirstTime = await AsyncStorage.getItem('firstTime')
            if (isFirstTime !== null)
            {
                if (isFirstTime == "1"){
                    return true
                }

                return false
            }
        }catch(e){
            console.log(e)
        }
    }

    const setID = async (value) => {
        try{
            await AsyncStorage.setItem('id', value)
            //console.log("added ID to async")
        }catch(e){
            console.log(e)
        }
    }

    const getID = async () => {
        try {
            const id = await AsyncStorage.getItem('id')
            if (id !== null)
            {
                return id
            }
        } catch (e) {
            console.log(e)
        }
        return '0'
    }

    const setName = async (value) => {
        try{
            await AsyncStorage.setItem('userName', value)
        }catch(e){

        }
    }

    const getName = async() => {
        try {
            const name = await AsyncStorage.getItem('userName')
            if (name !== null){
                return name
            }
            return "User"
        } catch (error) {
            
        }
    }

    const setDataCollectStartTime = async(value) =>{
        try{
            //console.log("timeeeee 1 " + value+"")
            await AsyncStorage.setItem('data_time', value+"")
        }catch(e){
            console.log(e)
        }
    }

    const getDataCollectStartTime = async () =>{
        try {
            const tm = await AsyncStorage.getItem('data_time')
            //console.log("timeeeee--- " + tm)
            if (tm != null){
                //console.log("   ------------------------- ")
                return tm
            }
                    
        } catch (e) {
            console.log(e)
        }
        return Date.now()
    }
    // const readData = async (key) => {
    //     try {
    //         const value = await AsyncStorage.getItem(key);
    //         if (value !== null) {
    //             alert(value)
    //         }
    //     } catch (e) {
    //         alert('Failed to fetch the input from storage');
    //     }
    // };

    const createSessionInfo = async(value) => {
        try {
            await AsyncStorage.setItem('sessionInfo', JSON.stringify(value));
            //console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }

    const createTempSessionInfo = async(value) => {
        try {
            await AsyncStorage.setItem('tempSessionInfo', JSON.stringify(value));
            //console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }

    const addTempSessionInfo = async(startTime, endTime, sessionDistanceCovered, wcId, sqa1, sqa2, sqa3, eqa1, eqa2, version) => {
        try {
            const existingArray = await AsyncStorage.getItem('tempSessionInfo');
            const newArray = existingArray ? JSON.parse(existingArray) : [];
            const userId = await getID()
            const valueToPush = newArray.length;
            newArray.push(valueToPush + "temp");
            await AsyncStorage.setItem('tempSessionInfo', JSON.stringify(newArray));
            const objToStore = {uid: userId.toString(), st: startTime.toString(), et: endTime.toString(), sbt: sessionDistanceCovered.toString(), wcId: wcId.toString(), sq1: sqa1, sq2: sqa2, sq3: sqa3, eq1: eqa1, eq2: eqa2, v: version}
            await AsyncStorage.setItem(valueToPush.toString() + "temp", JSON.stringify(objToStore))
        } catch (error) {
            console.log(error)
        }
    }

    const getTempSessionInfo = async() => {
        try {
            const existingArray = await AsyncStorage.getItem('tempSessionInfo');
            const newArray = existingArray ? JSON.parse(existingArray) : [];
            const objArr = []
            for (let i = 0; i < newArray.length; i++) {
                //console.log(newArray[i].toString())
                objArr.push(JSON.parse(await AsyncStorage.getItem(newArray[i].toString())))
            }
            return objArr
        } catch (error) {
            console.log(error)
        }
    }

    const addSessionInfo = async(startTime, endTime, sessionDistanceCovered) => {
        try {
            const existingArray = await AsyncStorage.getItem('sessionInfo');
            const newArray = existingArray ? JSON.parse(existingArray) : [];
            const valueToPush = newArray.length
            newArray.push(valueToPush);
            await AsyncStorage.setItem('sessionInfo', JSON.stringify(newArray));
            const objToStore = {lid: valueToPush.toString(), st: startTime.toString(), et: endTime.toString(), sbt: sessionDistanceCovered.toString()}
            await AsyncStorage.setItem(valueToPush.toString(), JSON.stringify(objToStore))
        } catch (error) {
            //console.error(error);
        }
    }

    const getSessionInfo = async() => {
        try {
            const existingArray = await AsyncStorage.getItem('sessionInfo');
            const newArray = existingArray ? JSON.parse(existingArray) : [];
            const objArr = []
            for (let i = 0; i < newArray.length; i++) {
                objArr.push(JSON.parse(await AsyncStorage.getItem(newArray[i].toString())))
            }

            return objArr
        } catch (error) {
            console.log(error)
        }
    }



    //WheelChair
    // const createWheelchairInfo = async(value) => {
    //     try {
    //         await AsyncStorage.setItem('wheelchairInfo', JSON.stringify(value));
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    const addWheelchairInfo = async(data, all) => {
        try {

            if (all == true){
                console.log(data)
                await AsyncStorage.setItem('wheelchairInfo', JSON.stringify(data));
                //await AsyncStorage.setItem('wheelchairInfo', "test data");
                console.log("Set wheelchair info done")
            }
                // }else{
            //     const existingArray = await AsyncStorage.getItem('wheelchairInfo');
            //     existingArray.push(data[0])
            //     await AsyncStorage.setItem('wheelchairInfo', JSON.stringify(existingArray));
            // }
        } catch (error) {
            console.log("Error in addWheelchairInfo")
            console.error(error);
        }
    }

    const loadUserWheelchairInfo = async() => {
        try {
            //console.log("inside async")
            const temp = await AsyncStorage.getItem('wheelchairInfo');
            return JSON.parse(temp)
        } catch (error) {
            console.log(error)            
        }
    }

    const deleteUserWheelchairInfo = async(id) =>{
        try {
            const temp = await AsyncStorage.getItem('wheelchairInfo');
            const allWc = JSON.parse(temp)
            const updatedData = allWc.filter(item => item.id !== id);
            await addWheelchairInfo(updatedData, true)
        } catch (error) {
            
        }
    }

    const addStartQnsAns = async(data) => {
        try {
            console.log(data)
            await AsyncStorage.setItem('startQnsAns', JSON.stringify(data));
            console.log("Start QnsAns done")
        } catch (error) {
            console.error(error);
        }
    }

    const getStartQnsAns = async() => {
        try {
            const temp = await AsyncStorage.getItem('startQnsAns');
            return JSON.parse(temp)
        } catch (error) {
            console.log(error)            
        }
    }

    export {storeToken, getToken, removeToken, setID, getID, setDataCollectStartTime, getDataCollectStartTime,
        setFirstTimeLoggedIn, checkUserFirstTimeFlag, checkFirstTimeLoggedIn, setName, getName, createSessionInfo, getSessionInfo, addSessionInfo,
        createTempSessionInfo, addTempSessionInfo, getTempSessionInfo, addWheelchairInfo, loadUserWheelchairInfo, deleteUserWheelchairInfo,
        addStartQnsAns, getStartQnsAns}