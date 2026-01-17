import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const enterpriseApi = createApi({
    reducerPath: 'enterpriseApi',
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
    tagTypes: ['Enterprise'],
    endpoints: (builder) => ({
        getEnterprises: builder.query({
            query: (params) => ({
                url: 'enterprises',
                params
            }),
            providesTags: ['Enterprise'],
        }),
        getEnterpriseById: builder.query({
            query: (id) => `enterprises/${id}`,
            providesTags: (result, error, id) => [{ type: 'Enterprise', id }],
        }),
        createEnterprise: builder.mutation({
            query: (data) => ({
                url: 'enterprises',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Enterprise'],
        }),
        updateEnterprise: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `enterprises/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Enterprise', { type: 'Enterprise', id }],
        }),
        deleteEnterprise: builder.mutation({
            query: (id) => ({
                url: `enterprises/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Enterprise'],
        }),
        onboardEnterprise: builder.mutation({
            query: (data) => ({
                url: 'enterprises/onboard',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Enterprise'],
        }),
    }),
});

export const {
    useGetEnterprisesQuery,
    useGetEnterpriseByIdQuery,
    useCreateEnterpriseMutation,
    useUpdateEnterpriseMutation,
    useDeleteEnterpriseMutation,
    useOnboardEnterpriseMutation
} = enterpriseApi;
