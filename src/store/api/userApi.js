import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
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
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => 'users/profile',
            transformResponse: (response) => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
                const transform = (user) => ({
                    ...user,
                    profile_picture_url: user.profile_picture ? `${baseUrl}${user.profile_picture}` : null,
                    aadhar_front_url: user.aadhar_front ? `${baseUrl}${user.aadhar_front}` : null,
                    aadhar_back_url: user.aadhar_back ? `${baseUrl}${user.aadhar_back}` : null,
                    pan_card_url: user.pan_card ? `${baseUrl}${user.pan_card}` : null,
                    cancelled_cheque_url: user.cancelled_cheque ? `${baseUrl}${user.cancelled_cheque}` : null,
                });
                return transform(response);
            },
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: 'users/profile',
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response) => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
                const transform = (user) => ({
                    ...user,
                    profile_picture_url: user.profile_picture ? `${baseUrl}${user.profile_picture}` : null,
                    aadhar_front_url: user.aadhar_front ? `${baseUrl}${user.aadhar_front}` : null,
                    aadhar_back_url: user.aadhar_back ? `${baseUrl}${user.aadhar_back}` : null,
                    pan_card_url: user.pan_card ? `${baseUrl}${user.pan_card}` : null,
                    cancelled_cheque_url: user.cancelled_cheque ? `${baseUrl}${user.cancelled_cheque}` : null,
                });
                return transform(response);
            },
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
