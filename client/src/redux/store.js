import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import {apiSlice} from "./slices/apiSlice"
import searchReducer from './slices/searchSlice';
import {chatSlice} from "./slices/chatSlice.js";
import chatMessagesReducer from "./slices/chatMessagesSlice.js";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [chatSlice.reducerPath]: chatSlice.reducer,
        auth: authReducer,
        search: searchReducer,
        chatMessages: chatMessagesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(chatSlice.middleware),
    devTools: true,
});

export default store;