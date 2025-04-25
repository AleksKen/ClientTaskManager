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
    tagTypes: ['Task', 'User', 'Label', 'Activity'],
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: () => '/tasks',
            providesTags: ['Task', 'Activity'],
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
        updateTask: builder.mutation({
            query: ({ id, ...updatedTask }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: updatedTask,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
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
        updateUser: builder.mutation({
            query: ({ id, ...updatedUser }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: updatedUser,
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),



        getLabels: builder.query({
            query: () => '/labels',
            providesTags: ['Label'],
        }),


        createActivity: builder.mutation({
            query: (activity) => ({
                url: '/activities',
                method: 'POST',
                body: activity,
            }),
            invalidatesTags: ['Activity'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetTaskQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,

    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,

    useGetLabelsQuery,
    useCreateActivityMutation,
} = apiSlice;
