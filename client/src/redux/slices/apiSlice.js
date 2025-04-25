import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:8080/api';

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ['Task', 'User', 'Label'],
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: () => '/tasks',
            providesTags: ['Task'],
        }),

        getTask: builder.query({
            query: (id) => `/tasks/${id}`,
            providesTags: (result, error, id) => [{ type: 'Task', id }],
        }),

        createTask: builder.mutation({
            query: (task) => ({
                url: '/tasks',
                method: 'POST',
                body: task,
            }),
            invalidatesTags: ['Task'],
        }),



        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['User'],
        }),

        createUser: builder.mutation({
            query: (user) => ({
                url: '/users',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['User'],
        }),



        getLabels: builder.query({
            query: () => '/labels',
            providesTags: ['Label'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetTaskQuery,
    useCreateTaskMutation,
    useGetUsersQuery,
    useCreateUserMutation,
    useGetLabelsQuery,
} = apiSlice;
