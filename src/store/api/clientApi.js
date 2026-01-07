import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clientApi = createApi({
    reducerPath: 'clientApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}clients`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Client'],
    endpoints: (builder) => ({
        getClients: builder.query({
            query: (params) => ({
                url: '/',
                params
            }),
            providesTags: ['Client'],
        }),
        getClientById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Client', id }],
        }),
        createClient: builder.mutation({
            query: (newClient) => ({
                url: '/',
                method: 'POST',
                body: newClient,
            }),
            invalidatesTags: ['Client'],
        }),
        updateClient: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Client', { type: 'Client', id }],
        }),
        deleteClient: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Client'],
        }),
    }),
});

export const {
    useGetClientsQuery,
    useGetClientByIdQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
} = clientApi;
