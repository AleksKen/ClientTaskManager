import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
    token: localStorage.getItem('token')
        ? localStorage.getItem('token')
        : null,
    isSidebarOpen: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.userInfo = user;
            state.token = token;
            localStorage.setItem('userInfo', JSON.stringify(user));
            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.userInfo = null;
            state.token = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
        },
        setOpenSidebar: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
    },
});

export const {
    setCredentials,
    logout,
    setOpenSidebar,
    setUserInfo,
} = authSlice.actions;

export default authSlice.reducer;
