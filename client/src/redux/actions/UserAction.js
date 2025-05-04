import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {setCredentials} from "../slices/authSlice.js";

const API_URL = 'https://servertaskmanager.onrender.com/api';
// const API_URL = 'http://localhost:8080/api';

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username: email,
                password,
            });

            dispatch(setCredentials(response.data));
            return response.data;
        } catch (error) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return rejectWithValue(message);
        }
    }
);
