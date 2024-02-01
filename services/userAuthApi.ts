// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: 'pokemonApi',

  //baseQuery: fetchBaseQuery({ baseUrl: 'http://MyPathWeb.csi.miamioh.edu:8080/api/user/'}),
  baseQuery: fetchBaseQuery({ baseUrl: 'https://mypathweb.csi.miamioh.edu/api/user/'}),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query:(user)=>{
        return {
            url:'create_user/',
            method:'POST',
            body:user,
            headers:{
                'Content-type' : 'application/json',
            }
        }
      }
    }),

    loginUser: builder.mutation({
      query:(user)=>{
        console.log("====== Login user ======")
        console.log(user)
        return {
            url:'login/',
            method:'POST',
            body:user,
            headers:{
                'Content-type' : 'application/json',
            }
        }
      }
    }),

    resetPass: builder.mutation({
      query:(data)=>{
        console.log(data)
        return {
            url:'send-reset-password-email/',
            method:'POST',
            body:data,
            headers:{
                'Content-type' : 'application/json',
            }
        }
      }
    }),

    sensData: builder.mutation({
      query:(data)=>{
        return {
            url:'sensor-data/',
            method:'POST',
            body:data,
            headers:{
                'Content-type' : 'application/json',
            }
        }
      }
    }),

    sessionData: builder.mutation({
      query:(sesdata)=>{
        console.log("====== session ======")
        console.log(sesdata)
        return {
            url:'session-data/',
            method:'POST',
            body:sesdata,
            headers:{
                'Content-type' : 'application/json',
            }
        }
      }
    }),

    getLoggedUser: builder.query({
      query: (token) => {
        //console.log(`Test "Bearer ${token}"`)
        return {
            url: 'profile/',
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`,
            }
        }
      }
    }),

    getUserSessions: builder.query({
      query: (token) => {
        //console.log(`Test "Bearer ${token}"`)
        return {
            url: 'sessions/',
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`,
            }
        }
      }
    }),

    tokenStatus: builder.mutation({
      query:(accessToken)=>{
        return {
            url:'check_access_token/',
            method:'POST',
            body:accessToken,
            headers:{
                'Content-type' : 'application/json',
            }
        }
      }
    }),

    tokenUpdate: builder.mutation({
      query:(refreshToken)=>{
        return {
            url:'refresh_access_token/',
            method:'POST',
            body:refreshToken,
            headers:{
                'Content-type' : 'application/json',
            }
        }
      }
    }),

    wheelchairDelete: builder.mutation({
      query:(tempObj)=>{
        console.log("inside wheelchair delete")
        //const fullStr = "\'wheelchair/${tempObj[1]}/\'"
        //console.log(fullStr)   
        
        return {
            url:`wheelchair/${tempObj[1]}/`,
            method:'DELETE',
            headers: {
                'Authorization' : `Bearer ${tempObj[0]}`,
            }
        }
      }
    }),

    createWheelchair: builder.mutation({
      query:(data)=>{
        return {
            url:'create_wheelchair/',
            method:'POST',
            body:data,
            headers:{
                'Content-type' : 'application/json',
            }
        }
      }
    }),

    wheelchairUpdate: builder.mutation({
      query:(tempObj)=>{
        console.log(tempObj)
        return {
            url:`wheelchair-update/${tempObj["id"]}/`,
            method:'PUT',
            body:tempObj,
            headers: {
                'Content-type' : 'application/json',
            }
        }
      }
    }),
  }),
})




export const { useRegisterUserMutation, useLoginUserMutation, useResetPassMutation, useSensDataMutation, useSessionDataMutation, useGetLoggedUserQuery, useGetUserSessionsQuery, useTokenStatusMutation, useTokenUpdateMutation, useWheelchairDeleteMutation, useGetWheelchairInfoQuery, useCreateWheelchairMutation, useWheelchairUpdateMutation } = userAuthApi