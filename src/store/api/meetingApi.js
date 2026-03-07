import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const meetingApi = createApi({
    reducerPath: 'meetingApi',
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
    tagTypes: ['Meeting'],
    endpoints: (builder) => ({
        getMeetings: builder.query({
            query: (params) => ({
                url: '/meetings',
                params,
            }),
            providesTags: ['Meeting'],
        }),
        createMeeting: builder.mutation({
            query: (newMeeting) => ({
                url: '/meetings',
                method: 'POST',
                body: newMeeting,
            }),
            invalidatesTags: ['Meeting'],
        }),
        updateMeeting: builder.mutation({
            query: ({ id, ...updatedMeeting }) => ({
                url: `/meetings/${id}`,
                method: 'PUT',
                body: updatedMeeting,
            }),
            invalidatesTags: (result, error, { id }) => ['Meeting', { type: 'Meeting', id }],
        }),
        deleteMeeting: builder.mutation({
            query: (id) => ({
                url: `/meetings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Meeting'],
        }),
    }),
});

export const {
    useGetMeetingsQuery,
    useCreateMeetingMutation,
    useUpdateMeetingMutation,
    useDeleteMeetingMutation,
} = meetingApi;
