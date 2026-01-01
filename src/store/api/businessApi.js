import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const businessApi = createApi({
    reducerPath: 'businessApi',
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
    tagTypes: ['BusinessInfo'],
    endpoints: (builder) => ({
        getBusinessInfo: builder.query({
            query: () => 'business-info',
            providesTags: ['BusinessInfo'],
        }),
        updateBusinessInfo: builder.mutation({
            query: (data) => {
                const formData = new FormData();
                Object.keys(data).forEach(key => {
                    if (key === 'logo' && data[key] instanceof File) {
                        formData.append('logo', data[key]);
                    } else if (data[key] !== undefined && data[key] !== null) {
                        formData.append(key, data[key]);
                    }
                });
                return {
                    url: 'business-info',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['BusinessInfo'],
        }),
        getPublicBusinessInfo: builder.query({
            query: (id) => `business-info/public/${id}`,
        }),
    }),
});

export const { useGetBusinessInfoQuery, useUpdateBusinessInfoMutation, useGetPublicBusinessInfoQuery } = businessApi;
