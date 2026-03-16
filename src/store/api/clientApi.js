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
        getClientQuotations: builder.query({
            query: (id) => `/${id}/quotations`,
            providesTags: (result, error, id) => [{ type: 'Client', id: `quotations-${id}` }],
        }),
        getClientFiles: builder.query({
            query: (id) => `/${id}/files`,
            providesTags: (result, error, id) => [{ type: 'Client', id: `files-${id}` }],
        }),
        addClientFile: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}/files`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Client', id: `files-${id}` }],
        }),
        deleteClientFile: builder.mutation({
            query: ({ clientId, fileId }) => ({
                url: `/${clientId}/files/${fileId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { clientId }) => [{ type: 'Client', id: `files-${clientId}` }],
        }),
    }),
});

export const {
    useGetClientsQuery,
    useGetClientByIdQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
    useGetClientQuotationsQuery,
    useGetClientFilesQuery,
    useAddClientFileMutation,
    useDeleteClientFileMutation,
} = clientApi;
