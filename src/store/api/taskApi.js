import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const taskApi = createApi({
    reducerPath: 'taskApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}tasks`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Task'],
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: (params) => ({
                url: '/',
                params: {
                    priority: params?.priority || 'all',
                    category: params?.category || 'All',
                    search: params?.search || '',
                    timeframe: params?.timeframe || '',
                    dateFrom: params?.dateFrom || '',
                    dateTo: params?.dateTo || '',
                }
            }),
            providesTags: ['Task'],
        }),
        getTaskById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Task', id }],
        }),
        createTask: builder.mutation({
            query: (newTask) => ({
                url: '/',
                method: 'POST',
                body: newTask,
            }),
            invalidatesTags: ['Task'],
        }),
        updateTask: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Task', { type: 'Task', id }],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),
        toggleTaskStatus: builder.mutation({
            query: (id) => ({
                url: `/${id}/toggle`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Task'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetTaskByIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useToggleTaskStatusMutation,
} = taskApi;
