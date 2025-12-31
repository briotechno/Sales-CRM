import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const leaveApi = createApi({
    reducerPath: 'leaveApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['LeaveRequest', 'LeaveType', 'Holiday'],
    endpoints: (builder) => ({
        // Leave Requests
        getLeaveRequests: builder.query({
            query: ({ page = 1, limit = 10, search = '', status = 'All' }) => ({
                url: `leave/all?page=${page}&limit=${limit}&search=${search}&status=${status}`,
                method: 'GET',
            }),
            providesTags: ['LeaveRequest'],
        }),
        createLeaveRequest: builder.mutation({
            query: (formData) => ({
                url: 'leave/apply',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['LeaveRequest'],
        }),
        updateLeaveStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `leave/status/${id}`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['LeaveRequest'],
        }),
        deleteLeaveRequest: builder.mutation({
            query: (id) => ({
                url: `leave/requests/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['LeaveRequest'],
        }),

        // Leave Types
        getLeaveTypes: builder.query({
            query: ({ page = 1, limit = 10, search = '', status = 'All' }) => ({
                url: `leave/types?page=${page}&limit=${limit}&search=${search}&status=${status}`,
                method: 'GET',
            }),
            providesTags: ['LeaveType'],
        }),
        createLeaveType: builder.mutation({
            query: (formData) => ({
                url: 'leave/types',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['LeaveType'],
        }),
        updateLeaveType: builder.mutation({
            query: ({ id, ...formData }) => ({
                url: `leave/types/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['LeaveType'],
        }),
        deleteLeaveType: builder.mutation({
            query: (id) => ({
                url: `leave/types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['LeaveType'],
        }),

        // Holidays
        getHolidays: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: `leave/holidays?page=${page}&limit=${limit}&search=${search}`,
                method: 'GET',
            }),
            providesTags: ['Holiday'],
        }),
        createHoliday: builder.mutation({
            query: (formData) => ({
                url: 'leave/holidays',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Holiday'],
        }),
        updateHoliday: builder.mutation({
            query: ({ id, ...formData }) => ({
                url: `leave/holidays/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Holiday'],
        }),
        deleteHoliday: builder.mutation({
            query: (id) => ({
                url: `leave/holidays/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Holiday'],
        }),
    }),
});

export const {
    useGetLeaveRequestsQuery,
    useCreateLeaveRequestMutation,
    useUpdateLeaveStatusMutation,
    useDeleteLeaveRequestMutation,
    useGetLeaveTypesQuery,
    useCreateLeaveTypeMutation,
    useUpdateLeaveTypeMutation,
    useDeleteLeaveTypeMutation,
    useGetHolidaysQuery,
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
} = leaveApi;
