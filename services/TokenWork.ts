import { useTokenStatusMutation, useTokenUpdateMutation } from './userAuthApi';
import { Alert } from 'react-native';
import {storeToken} from './AsyncStorageService';

export const useAccessTokenStatus = () => {
    const [tokenStatus] = useTokenStatusMutation()
    const [tokenRefresh] = useTokenUpdateMutation()
    const checkAccessToken = async (accessToken, refreshToken, suppressError) => {
        //console.log("inside TokenWork")
        try{
            const jsonObject = {
                access_token: accessToken,
            };
            const response = await tokenStatus(jsonObject)
            if (response.data) {
                console.log('Access token status:', response.data);
                return true
            }
            
            if (response.error && response.error.status == "FETCH_ERROR" && !suppressError){
                showAlert("Check your internet connection and try again")
            }else if(response.error && response.error.status == 401){

                console.log("Inside response error || access token expired")
                console.log(refreshToken)
                const jsonObject = {
                    refresh_token: refreshToken,
                };
                const newToken = await tokenRefresh(jsonObject)
                if (newToken.data)
                {
                    const tokenValue = {
                        access: newToken.data.access_token,
                        refresh: refreshToken
                    }
                    await storeToken(tokenValue)
                    console.log("Successfully refreshed the token")
                    return true
                }
                if(newToken.error){
                    console.log("Refresh token failed")
                }
                console.log("Need to refresh the tocken")
            }
            
            return false
        } catch (error) {
            console.error('Network error while checking access token status', error);
            return false
        }
    };

    const showAlert = (mgs) => {
    Alert.alert(
        'Alert!',
            mgs,
        [{
            text: 'OK', // Button text
            onPress: () => console.log('OK Pressed'), // Action when OK button is pressed
        },],
        { cancelable: true } // Prevents tapping outside of the alert to dismiss it
    );};

    return checkAccessToken;
};
