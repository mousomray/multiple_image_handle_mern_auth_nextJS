import Cookies from 'js-cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { myendpoints } from '../api/endpoints';

const initialState = {
    loading: false,
    user: {}, // for user object
    Logouttoggle: false, // For Logout Button 
    userName: false,
}

// API fetch for Register
export const registerUser = createAsyncThunk("/signup", async (user) => {
    try {
        const apiurl = myendpoints[0] 
        const response = await axiosInstance.post(apiurl, user);
        console.log("Fetching Reg data...", response);
        if (response && response?.data?.success === true) {
            toast.success(response?.data?.message)
        } else {
            toast.error(response?.data?.message)
        }
        return response?.data
    } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log("Error fetching register data...",error);
    }
});

// API fetch for Login
export const loginRequest = createAsyncThunk("login", async (user) => {
    try {
        const apiurl = myendpoints[1]
        const response = await axiosInstance.post(apiurl, user);
        console.log("Fetching Login data...", response);

        if (response && response?.data?.success === true) {
            //toast.success(response?.data?.message)
        } else {
            toast.error(response?.data?.message)
        }
        return response?.data
    } catch (error) {
        console.log("Error fetching login data", error);
        toast.error(error?.response?.data?.message);
    }
});



export const AuthSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        //check for auth token 
        check_token: (state, { payload }) => {
            let token = Cookies.get('token'); // Retrieves the token value from cookies
            if (token !== null && token !== undefined) {
                state.Logouttoggle = true;
            }
        },

        logout: (state, { payload }) => {
            Cookies.remove('token'); // Removes the token from cookies
            Cookies.remove('name');
            Cookies.remove('email');
            Cookies.remove('profile_pic');
            toast.success("Logout successfully")
            state.Logouttoggle = false

        },


        // For to go Register page after keeping token in local storage 
        RegLog: (state, { payload }) => {
            Cookies.remove('name'); // Removes the name from cookies
            state.Logouttoggle = false

        },

    },

    extraReducers: (builder) => {

        // Register Request
        builder

            //For Registration Pending
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            //For Registration Fulfilled
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false;
            })

            //For Registration Reject
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });


        // Login Request
        builder

            .addCase(loginRequest.pending, (state, action) => {
                state.loading = true;
            })

            .addCase(loginRequest.fulfilled, (state, { payload }) => {
                state.loading = false;
                console.log("My Login Payload...", payload);
                if (payload?.success === true) {
                    Cookies.set('token', payload?.token, { expires: 1 }); // Store token with a 1-day expiry
                    Cookies.set('name', payload?.data?.name);
                    Cookies.set('email', payload?.data?.email);
                    Cookies.set('profile_pic', payload?.data?.profile_pic);
                    state.Logouttoggle = true;
                    toast.success(`Hi ${payload?.data?.name} ${payload?.message}`)
                }
            })
            .addCase(loginRequest.rejected, (state, action) => {
                state.loading = false;
            });
    }

})

export const { check_token, logout, RegLog } = AuthSlice.actions