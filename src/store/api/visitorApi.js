import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const visitorApi = createApi({
    reducerPath: 'visitorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Visitor'],
    endpoints: (builder) => ({
        getVisitors: builder.query({
            query: (params) => ({
                url: '/visitors',
                params,
            }),
            providesTags: ['Visitor'],
        }),
        getDueVisitors: builder.query({
            query: () => '/visitors/due-visitors',
            providesTags: ['Visitor'],
        }),
        getVisitorById: builder.query({
            query: (id) => `/visitors/${id}`,
            providesTags: (result, error, id) => [{ type: 'Visitor', id }],
        }),
        createVisitor: builder.mutation({
            query: (newVisitor) => ({
                url: '/visitors',
                method: 'POST',
                body: newVisitor,
            }),
            invalidatesTags: ['Visitor'],
        }),
        updateVisitor: builder.mutation({
            query: ({ id, ...updatedVisitor }) => ({
                url: `/visitors/${id}`,
                method: 'PUT',
                body: updatedVisitor,
            }),
            invalidatesTags: (result, error, { id }) => ['Visitor', { type: 'Visitor', id }],
        }),
        deleteVisitor: builder.mutation({
            query: (id) => ({
                url: `/visitors/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Visitor'],
        }),
    }),
});

export const {
    useGetVisitorsQuery,
    useGetDueVisitorsQuery,
    useGetVisitorByIdQuery,
    useCreateVisitorMutation,
    useUpdateVisitorMutation,
    useDeleteVisitorMutation,
} = visitorApi;
