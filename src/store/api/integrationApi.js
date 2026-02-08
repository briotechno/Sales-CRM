import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const integrationApi = createApi({
    reducerPath: 'integrationApi',
    baseQuery: fetchBaseQuery({
        // VITE_API_BASE_URL already ends with a slash (e.g., http://localhost:5000/api/)
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}integrations/`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['CRMForm', 'GoogleSheet', 'SyncLog'],
    endpoints: (builder) => ({
        // CRM Forms
        getForms: builder.query({
            query: (params) => ({
                url: 'forms',
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    search: params?.search || '',
                    status: params?.status === 'All' ? '' : params?.status
                }
            }),
            providesTags: ['CRMForm'],
        }),
        createForm: builder.mutation({
            query: (data) => ({
                url: 'forms',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CRMForm'],
        }),
        updateForm: builder.mutation({
            query: ({ id, data }) => ({
                url: `forms/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['CRMForm'],
        }),
        deleteForm: builder.mutation({
            query: (id) => ({
                url: `forms/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CRMForm', 'SyncLog'],
        }),

        // Google Sheets
        getSheetsConfigs: builder.query({
            query: (params) => ({
                url: 'sheets',
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    search: params?.search || '',
                    sync_frequency: params?.sync_frequency === 'All' ? '' : params?.sync_frequency
                }
            }),
            providesTags: ['GoogleSheet'],
        }),
        createSheetConfig: builder.mutation({
            query: (data) => ({
                url: 'sheets',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['GoogleSheet'],
        }),
        updateSheetConfig: builder.mutation({
            query: ({ id, data }) => ({
                url: `sheets/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['GoogleSheet'],
        }),
        deleteSheetConfig: builder.mutation({
            query: (id) => ({
                url: `sheets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['GoogleSheet'],
        }),
        syncSheet: builder.mutation({
            query: (id) => ({
                url: `sheets/${id}/sync`,
                method: 'POST',
            }),
            invalidatesTags: ['SyncLog'],
        }),

        // Logs
        getLogs: builder.query({
            query: (params) => ({
                url: 'logs',
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    channel_type: params?.channel_type || ''
                }
            }),
            providesTags: ['SyncLog'],
        }),
    }),
});

export const {
    useGetFormsQuery,
    useCreateFormMutation,
    useUpdateFormMutation,
    useDeleteFormMutation,
    useGetSheetsConfigsQuery,
    useCreateSheetConfigMutation,
    useUpdateSheetConfigMutation,
    useDeleteSheetConfigMutation,
    useSyncSheetMutation,
    useGetLogsQuery,
} = integrationApi;
