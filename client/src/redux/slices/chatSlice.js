import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const API_URL = 'http://localhost:8000';
const API_URL = 'https://4c86-34-16-147-6.ngrok-free.app';

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('ngrok-skip-browser-warning', 'true');
        return headers;
    },
});

export const chatSlice = createApi({
    reducerPath: 'chatApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        askChat: builder.query({
            query: (question) => ({
                url: '/chat',
                method: 'GET',
                params: { question },
            }),
        }),
    }),
});

export const { useLazyAskChatQuery } = chatSlice;
